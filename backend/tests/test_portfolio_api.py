"""
Backend regression tests for the Yachi Darji portfolio API.
Covers: /api/ health, /api/contact validation & rate limit (5/10min per IP).
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://data-lab-chi.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health --------------------------------------------------------------

class TestHealth:
    def test_root_api(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert "Portfolio" in data["message"] or "AI Systems" in data["message"]


# --- Contact -------------------------------------------------------------

class TestContact:
    def test_contact_valid_payload(self, api_client):
        payload = {
            "name": f"TEST_user_{uuid.uuid4().hex[:6]}",
            "email": f"test_{uuid.uuid4().hex[:6]}@example.com",
            "message": "TEST_message hello from pytest",
        }
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["message"] == payload["message"]
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert "timestamp" in data

    def test_contact_invalid_email_returns_422(self, api_client):
        payload = {"name": "TEST_bad", "email": "not-an-email", "message": "x"}
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 422

    def test_contact_missing_fields(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={"email": "a@b.com"})
        assert r.status_code == 422

    def test_contact_empty_message(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/contact",
            json={"name": "TEST_x", "email": "a@b.com", "message": ""},
        )
        assert r.status_code == 422


# --- Rate limit ----------------------------------------------------------

class TestContactRateLimit:
    """
    Rate limit: 5 successful posts per source IP per 10min (in-memory).
    Backend uses request.client.host, so behind a k8s ingress load-balancer
    the IP alternates between upstream pods. Testing on localhost:8001 to
    validate the *rate-limit logic itself* deterministically. A note on the
    ingress limitation is captured in the test report.
    """

    def test_rate_limit_kicks_in_localhost(self):
        s = requests.Session()
        s.headers.update({"Content-Type": "application/json"})
        payload_base = {
            "name": "TEST_rate",
            "email": "ratelimit_local@example.com",
            "message": "TEST_rate_limit_msg",
        }
        codes = []
        for _ in range(8):
            r = s.post("http://127.0.0.1:8001/api/contact", json=payload_base)
            codes.append(r.status_code)
        assert 429 in codes, f"Expected a 429 after 5 valid posts, got: {codes}"
        successes = [c for c in codes if c == 200]
        assert len(successes) >= 5, f"Expected 5 successes before 429, got: {codes}"
