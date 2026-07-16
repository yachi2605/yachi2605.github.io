from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import time
import logging
import httpx
from collections import defaultdict, deque
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# In-memory rate-limit buckets (per-process; fine for a portfolio contact form)
_contact_hits = defaultdict(deque)

# Emergent managed email proxy (constant — must NOT come from env, survives deploy)
EMAIL_BASE_URL = "https://integrations.emergentagent.com"


async def send_contact_notification(contact: "Contact"):
    """Notify the site owner of a new contact message. Degrades gracefully."""
    email_key = os.environ.get("EMERGENT_EMAIL_KEY")
    owner = os.environ.get("OWNER_EMAIL")
    from_name = os.environ.get("EMAIL_FROM_NAME", "Portfolio")
    if not email_key or not owner:
        logging.info("Email not configured; skipping contact notification.")
        return
    html = f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f1e;padding:24px;font-family:Arial,sans-serif;">
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#14172a;border:1px solid rgba(255,255,255,0.1);">
          <tr><td style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.1);">
            <div style="color:#5B73FF;font-size:11px;letter-spacing:2px;text-transform:uppercase;">new message · portfolio</div>
            <div style="color:#ffffff;font-size:22px;margin-top:6px;">You got a new message</div>
          </td></tr>
          <tr><td style="padding:24px 28px;color:#ffffff;">
            <p style="margin:0 0 6px;color:#a3a3a3;font-size:12px;">FROM</p>
            <p style="margin:0 0 18px;font-size:16px;">{contact.name} &lt;{contact.email}&gt;</p>
            <p style="margin:0 0 6px;color:#a3a3a3;font-size:12px;">MESSAGE</p>
            <p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap;">{contact.message}</p>
          </td></tr>
          <tr><td style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.1);color:#6b7280;font-size:11px;">
            {contact.timestamp.isoformat()} · reply directly to this email
          </td></tr>
        </table>
      </td></tr>
    </table>
    """
    payload = {
        "to": [owner],
        "subject": f"New portfolio message from {contact.name}",
        "html": html,
        "from_name": from_name,
        "contact_email": contact.email,
    }
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": email_key},
                json=payload,
            )
        resp.raise_for_status()
        logging.info("Contact notification email sent.")
    except Exception:
        logging.exception("Contact notification email failed (non-fatal).")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "AI Systems Lab · Portfolio API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate, request: Request):
    # Simple in-memory IP rate limit: max 5 submissions / 10 min.
    # Behind the k8s ingress, request.client.host is the upstream pod, so
    # prefer the real client from X-Forwarded-For / X-Real-IP.
    fwd = request.headers.get("x-forwarded-for", "")
    ip = (
        fwd.split(",")[0].strip()
        or request.headers.get("x-real-ip", "").strip()
        or (request.client.host if request.client else "unknown")
    )
    now = time.monotonic()
    window = _contact_hits[ip]
    while window and now - window[0] > 600:
        window.popleft()
    if len(window) >= 5:
        raise HTTPException(status_code=429, detail="Too many messages. Try again later.")
    window.append(now)

    obj = Contact(**payload.model_dump())
    doc = obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    try:
        await db.contacts.insert_one(doc)
    except Exception:
        logging.exception("contact insert failed")
        raise HTTPException(status_code=500, detail="storage failed")

    await send_contact_notification(obj)
    return obj


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts():
    docs = await db.contacts.find({}, {"_id": 0}).sort("timestamp", -1).to_list(500)
    for c in docs:
        if isinstance(c['timestamp'], str):
            c['timestamp'] = datetime.fromisoformat(c['timestamp'])
    return docs


app.include_router(api_router)

# CORS: never combine wildcard origins with credentials. This form uses no
# cookies, so credentials stay off and an explicit origin can be set in prod.
_cors_origins = os.environ.get('CORS_ORIGINS', '*').split(',')
_allow_credentials = '*' not in _cors_origins
app.add_middleware(
    CORSMiddleware,
    allow_credentials=_allow_credentials,
    allow_origins=_cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
