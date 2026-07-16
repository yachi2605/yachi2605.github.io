# Yachi Darji — AI Systems Laboratory (Portfolio)

## Problem
Build a personal portfolio for Yachi Darji (Data Scientist / ML Engineer) positioned as an interactive **AI Systems Laboratory** — not a resume. Awwwards-level polish, dark editorial aesthetic, zero paid API dependency for AI features (no chatbot).

## Personas
1. **Recruiter / Hiring Manager** — scans for signal in <30s; needs role, location, visa, live products, resume.
2. **Engineering Lead** — wants to see systems thinking, architecture decisions, tradeoffs.
3. **Peer / Curious visitor** — wants to explore easter eggs (terminal, palette, achievements).

## Core requirements (static)
- Dark theme #0d0f1e · accent #5B73FF · live-state green #4ADE80
- Fonts: Cormorant Garamond (display) + Inter (body) + JetBrains Mono (system)
- No 3D globe, no AI chatbot, no synthetic forecast demo
- Smooth momentum scroll (Lenis) + Framer Motion micro-interactions
- Sections: Hero · TechField · Manifesto · Marquee · Projects · Arch Explorer · Labelmaster case · Timeline · Skills · Contact · Footer
- Overlays: Terminal (backtick shortcut) · Command Palette (⌘K/Ctrl+K)
- Contact form persists to MongoDB (FastAPI /api/contact)

## Implemented (2025-12-16 — v1)
- ✅ Kinetic hero with scramble-decode name and masked line-by-line reveal
- ✅ System Status monitoring-card (monospace key:value, pulsing green dot)
- ✅ Cursor-reactive tech-icon field (10 real logos, gently repel from cursor)
- ✅ Numbered manifesto chapters (4 chapters, editorial columns)
- ✅ Slow editorial marquee (react-fast-marquee, serif italic)
- ✅ Projects section with filter tabs + tilt-on-hover cards + real screenshots for RentPilot/SupplyChainIQ/CatSense
- ✅ RentPilot Architecture Explorer (5 clickable pipeline nodes with tech/decision/tradeoff)
- ✅ Labelmaster case study with Recharts bar chart (LSTM vs XGBoost across 8 depts)
- ✅ Interactive timeline 2022→2026 (5 clickable year rail)
- ✅ 3-tier skills (Core cards / Daily pills / Supporting tags) + credentials list
- ✅ Contact form (name/email/message) with backend POST /api/contact + Sonner toasts + direct-channel links
- ✅ Terminal easter egg: help/about/experience/projects/skills/credentials/resume/contact/whoami/clear/theme/coffee/sudo hire yachi/achievements
- ✅ Command Palette ⌘K with arrow-nav, group headers (Sections/Projects/Skills/Links)
- ✅ Achievement toast system (unlocks on 7 interactive features)
- ✅ Nav (About/Work/Skills/Contact + ⌘K + Resume button)
- ✅ Footer with giant serif watermark

## Backlog (P1)
- [ ] Real hosted screenshots for RentPilot & SupplyChainIQ (user provided architecture diagrams — need to upload to CDN and swap URLs in `/app/frontend/src/data/content.js`)
- [ ] llms.txt at site root
- [ ] Analytics (privacy-friendly: PostHog already loaded)
- [ ] Backend contact rate-limiting
- [ ] Email notification via Resend when contact form is submitted

## Backlog (P2)
- [ ] Case-study modal deep dives (per-project)
- [ ] MDX-powered blog / notes
- [ ] Dark/light theme toggle in nav (light theme not yet designed)

## Tech
- React 19 · Framer Motion · Lenis · Recharts · Sonner · cmdk · react-icons · react-fast-marquee
- FastAPI · Motor (MongoDB) · Pydantic v2

## Test credentials
Not applicable (no auth).

## Round 2 (2025-12-16 — v1.1)
- ✅ Removed standalone homepage Architecture Explorer section
- ✅ Architecture now scoped INSIDE project cards as a modal — RentPilot (client→api→ai→data→auth) + SupplyChainIQ (browser→ingestion→compete→api→db), each faithful to its real pipeline
- ✅ Projects header cleaned ("Not resume bullets" removed)
- ✅ Voice pass on Manifesto / Timeline / Labelmaster copy (kept all real numbers)
- ✅ Visual craft: cursor-follow glow (pointer:fine only), spring-physics 3D tilt on project cards, count-up stats on Labelmaster
- ✅ Backend: contact rate limit (5/10min, keyed off X-Forwarded-For), safe CORS (credentials auto-off with wildcard)
- ✅ Email notification on contact submit via Emergent-managed Resend proxy (degrades gracefully if unconfigured) — sends to darjiyachi8@gmail.com
- ✅ Resume migrated to /public/yachi-darji-resume.pdf (no longer platform-CDN dependent)
- Testing iteration 2: backend 100% (6/6), frontend 100%

## Still TODO
- [ ] Swap RentPilot & SupplyChainIQ card images to real product screenshots (currently the architecture diagrams / abstract) — update `image` in content.js
- [ ] For production deploy: set CORS_ORIGINS in backend/.env to the real domain
- [ ] (Optional) gate recharts render behind in-view observer to silence benign width/height console warning
