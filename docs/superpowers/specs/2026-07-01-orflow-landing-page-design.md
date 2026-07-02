# Orflow Landing Page Design

## Overview

A single-page marketing landing page for Orflow — a recurring billing API built on Nomba's payment primitives. The page targets developers and follows the Svix.com structural pattern with an orange-centric warm color palette (primary `#f59e0b`).

## Section Map

1. Nav → 2. Hero + logo wall → 3. Pain points → 4. Code snippet → 5. Benefits → 6. Designed for devs → 7. Testimonial → 8. Security → 9. Integrations → 10. Use cases → 11. CTA → 12. FAQ → 13. Footer

---

## 1. Navigation

- Sticky fixed top, `z-50`, `midnight-soft` (#2d2822) background
- Left: "Orflow" logo text, bold, on-ink white
- Center links: Developers, Docs (external icon, links to `/docs`), Pricing
- Right: GitHub icon link + "Get started" primary CTA button
- Hamburger menu below 768px
- `cursor: pointer` on all interactive elements, 44px min touch targets

## 2. Hero

- Full-bleed `midnight` (#1c1814) background with warm orange gradient/glow accent
- `display-xl` headline: Manrope bold, 56-64px, on-ink white
- `display-sm` subtitle: Manrope regular, 18-20px, `on-ink-soft` (#d4cdbd)
- Two CTAs: "Start building" (primary orange filled) + "Read the docs" (outlined white)
- Customer logo wall: grayscale brand logos in rows
- "Built on Nomba" badge

## 3. Pain Points

- Background: `canvas` (#fefbf5)
- 4-card grid: Proration, Dunning, Failed payment recovery, Outbound webhooks
- Each card: `paper` bg, `hairline` border, `rounded-lg` (8px), `soft-lift` shadow, orange icon, heading, description
- Narrative: "Subscriptions are harder than they seem..."

## 4. Code Snippet

- Dark code-block section (`ink` #1c1814 bg)
- curl REST API example: create plan → generate checkout → Orflow handles rest
- Language tabs: curl, Python (requests), JavaScript (fetch)
- "View API reference →" link below

## 5. Benefits

- Background: `canvas`
- 4 pillar cards in a grid:
  1. Great experience for customers — self-service portal
  2. Fast time to market — one API call, no billing infra
  3. Merchant dashboard — plans, subscribers, webhooks, settings
  4. Scales with you — from 10 to 10,000 subscribers
- Each: `paper` card, `hairline` border, orange icon, heading, description

## 6. Designed for Developers

- Background: `canvas`
- Two columns: left — resource links (Docs, API Ref, GitHub, Status); right — curl code snippet showing full 3-step flow
- Language tabs: curl, Python, JavaScript

## 7. Testimonial

- Background: `canvas`
- Single centered quote card on `paper` with orange accent top bar
- Quote from Team Blueprint: "We built Orflow because we lived this pain ourselves"

## 8. Security

- Background: `canvas`
- Row of security badges: PCI-DSS compliant (via Nomba), Tokenized cards, Signed webhooks (HMAC-SHA256), Scoped API keys

## 9. Integrations

- Background: `canvas`
- Horizontal 3-step flow diagram: Nomba Checkout → Nomba Tokenized Card API → Nomba Webhooks
- Each step: icon + label, connected by arrows

## 10. Use Cases

- Background: `canvas`
- 4-column card grid: SaaS, Gyms & fitness, Content platforms, Online schools
- Each: icon, title, description, "Learn more →" placeholder link

## 11. CTA Banner

- Full-width `midnight` background, centered
- Headline: "Start building on Orflow"
- Subtitle: "One API. Nomba's infrastructure. Your product, shipped."
- Two CTAs: "Get started" (orange filled) + "Read the docs" (white outline)

## 12. FAQ

- Background: `canvas`
- Accordion on `paper` cards
- Questions: What is Orflow?, How does it work with Nomba?, What happens on payment failure?, Card data storage?, Dashboard?, Proration?, Trials?, How to get started?

## 13. Footer

- Background: `midnight-soft`
- Columns: Product (Docs, API Ref, Pricing), Developers (GitHub, Status), Company (Team Blueprint, Nomba Hackathon 2026)
- Copyright "Team Blueprint"

---

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| primary | `#f59e0b` | Primary CTA buttons |
| primary-hover | `#d97706` | Button hover |
| primary-soft | `#fef3c7` | Subtle highlights |
| ink | `#1c1814` | Body text |
| ink-soft | `#6b6258` | Muted text |
| on-ink | `#ffffff` | Text on dark bg |
| on-ink-soft | `#d4cdbd` | Muted text on dark |
| midnight | `#1c1814` | Hero background |
| midnight-soft | `#2d2822` | Nav/footer bg |
| canvas | `#fefbf5` | Light section bg |
| paper | `#ffffff` | Card bg |
| hairline | `#f0ebe3` | Borders |

### Typography
- Body + Headings: Manrope (`@fontsource-variable/manrope`)
- Code: Geist Mono (from `geist` package)

### Spacing
- All spacing from scale: xxs (4px), xs (8px), sm (12px), md (16px), lg (24px), xl (32px), xxl (48px), section-md (96px), section-lg (128px)

### Rounded corners
- sm (4px), md (6px), lg (8px)

### Shadows
- soft-lift, card, modal, focus-ring

### Motion
- transition-default: 150ms cubic-bezier on color, bg, border-color, box-shadow, transform

### Responsive
- Single column <480px
- Progressive grid columns through tablet/desktop
- Hamburger nav at 768px and below

---

## Constraints
- Primary orange (#f59e0b) reserved for single most important CTA per viewport — never for text, icons, or secondary buttons
- `cursor: pointer` on every clickable element
- Focus ring (#f59e0b ring) on all interactive elements
- Touch targets minimum 44px on mobile
- Build must pass `npm run build` (tsc -b && vite build)
