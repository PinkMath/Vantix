# Vantix — Cybersecurity Learning Platform

## 1. Project Description
Vantix is a cybersecurity education and awareness platform targeted at developers, students, and IT professionals who want to learn cybersecurity best practices interactively. It features hands-on tutorials, real-time threat intelligence news, and practical security tools — all in a single, sleek interface. The platform supports English and Portuguese (pt-BR) via i18n.

## 2. Page Structure
- `/` — Homepage (Hero, Tutorials, Threat News, Tools, CTA)
- `/tutorials` — Full tutorials listing (Phase 2)
- `/news` — Full threat news feed (Phase 2)
- `/tools` — All security tools (Phase 2)

## 3. Core Features
- [x] Dynamic Hero Banner with animated background
- [x] Navigation tabs (Tutorials, Threat News, Tools)
- [x] Interactive Tutorials section (card grid)
- [x] Latest Threat News section (live-feel feed)
- [x] Learning Tools section (Password Analyzer, CVE Lookup, Encryption Sandbox)
- [x] CTA / Login prompt
- [x] Footer with newsletter subscription
- [x] PT-BR / EN language toggle (i18n)
- [ ] Full Tutorials listing page (Phase 2)
- [ ] Full Threat News page (Phase 2)
- [ ] Full Tools page (Phase 2)

## 4. Data Model Design
No database required for Phase 1. Mock data used for tutorials, news, and tools.

## 5. Backend / Third-party Integration Plan
- Supabase: Not needed in Phase 1. Could be added for user auth in Phase 2.
- Shopify: Not applicable.
- Stripe: Not applicable.
- i18n: react-i18next with EN and PT-BR locales.

## 6. Development Phase Plan

### Phase 1: Homepage (Current)
- Goal: Build the complete homepage with all sections and i18n support
- Deliverable: Fully functional homepage with EN/PT-BR toggle

### Phase 2: Inner Pages
- Goal: Build Tutorials, News, and Tools detail pages
- Deliverable: Linked sub-pages with full content

### Phase 3: User Auth (Optional)
- Goal: Add login/signup via Supabase Auth
- Deliverable: Authenticated user sessions, saved progress
