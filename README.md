# Orflow Frontend

> Recurring billing for Nomba merchants. No rebuild required.

A managed subscription billing API built on Nomba's payment primitives. Orflow handles plan management, card tokenization, scheduled charges, proration, dunning, and outbound webhooks — so merchants don't have to build billing infrastructure from scratch.

Built by **Team Blueprint** for the **DevCareer x Nomba Hackathon 2026**.

---

## Walkthrough

### Landing Page (`/`)

Marketing site with product overview, feature highlights, and CTA to sign in or create an account.

### Authentication

Google OAuth sign-in. Session managed via httpOnly cookies — no tokens stored in the browser. Public routes (`/subscribe/{code}`, `/portal/*`) do not require authentication.

### Account Dashboard (`/dashboard`)

Project selector on the left sidebar. Shows all projects belonging to your tenant. Each project has its own isolated data (plans, customers, subscriptions, webhooks).

### Project Dashboard (`/dashboard/{projectId}`)

Overview analytics for the selected project: MRR, active subscribers, recent payments, subscription growth chart.

### Plans (`/dashboard/{projectId}/plans`)

Create and manage billing plans. Each plan defines a name, amount (in minor units), currency, billing interval, optional trial period, and installments count.

### Subscriptions (`/dashboard/{projectId}/subscriptions`)

View all subscriptions for the project. Each row shows the customer, plan, status, and next charge date. Actions: pause, resume, cancel, change plan.

### Customers (`/dashboard/{projectId}/customers`)

View and search customers. Each customer card shows their subscriptions, payment methods, and portal credentials.

### Subscription Pages (`/dashboard/{projectId}/subscription-pages`)

Create shareable checkout links (`/subscribe/{code}`) linked to a plan. Customers enter their name/email and pay via Nomba's hosted checkout. After payment, they receive an email with portal access credentials.

### Webhooks (`/dashboard/{projectId}/webhooks`)

Manage outbound webhook endpoints. View event delivery logs and retry failed deliveries.

### Project Settings (`/dashboard/{projectId}/settings`)

Configure project name, description, default callback URL (for API integration subscriptions), and toggle sandbox/live environment. Environment mode is stored per-project — switching projects preserves each project's environment setting.

### Account Settings (`/dashboard/settings`)

Manage API keys (pk_test, sk_test, pk_live, sk_live). Generate, reveal, roll, and revoke keys.

### Self-Service Portal

Customers access their billing portal at `/portal/access/{slug}` and authenticate via a 6-digit PIN sent by email. The portal dashboard (`/portal/dashboard`) shows:

- **Plan summary** — name, price, status, next charge date
- **Payment method** — masked card number, brand, inline card update via Nomba SDK
- **Payment history** — past charges with status
- **Subscription actions** — pause, resume, cancel
- **PIN management** — change portal PIN

### Post-Checkout Callback

After Nomba checkout, customers are redirected to `/portal/callback?orderId=xxx&orderReference=yyy`. The callback route verifies payment and forwards them to the portal access page. If the portal token isn't available yet, a success page with email instructions is shown.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Bundler | Vite 6 |
| UI | React 18, TypeScript 5.6 |
| Routing | TanStack Router v1 (file-based) |
| Styling | Tailwind CSS v4 |
| Icons | @solar-icons/react |
| State | TanStack Query v5 |
| HTTP | axios |
| Fonts | Manrope Variable, Geist Mono Variable |

## Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── apiClient.ts      # Axios instance, interceptors, CSRF
│   │   ├── hooks/            # React Query hooks
│   │   └── types/            # TypeScript interfaces for API responses
│   ├── components/
│   │   ├── icons/            # Custom SVG icons
│   │   ├── ui/               # shadcn-style primitives
│   │   └── ...
│   ├── lib/
│   │   ├── auth.ts           # Cookie-based auth helpers
│   │   ├── environment.tsx   # Per-project sandbox/live context
│   │   ├── portal-auth.ts    # Portal session token storage
│   │   ├── portal-queries.ts # Portal API hooks
│   │   └── portal-data.ts    # Portal TypeScript types
│   ├── routes/               # TanStack Router file-based routes
│   │   ├── __root.tsx
│   │   ├── index.tsx         # Landing page
│   │   ├── subscribe.$code.tsx  # Public checkout form
│   │   ├── portal.tsx        # Portal layout
│   │   ├── portal.callback.tsx  # Post-checkout callback
│   │   ├── portal.access.$tokenSlug.tsx  # PIN entry
│   │   ├── portal.dashboard.tsx    # Customer self-service portal
│   │   ├── dashboard.tsx     # Account dashboard layout
│   │   ├── dashboard.$projectId/  # Per-project pages
│   │   └── ...
│   ├── index.css
│   ├── main.tsx
│   └── routeTree.gen.ts      # Auto-generated
├── public/
├── package.json
└── vite.config.ts
```

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server (proxies API to https://orflow-backend.onrender.com)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend API URL |
| `VITE_NOMBA_CLIENT_ID` | — | Nomba client ID for card-update SDK |
| `VITE_NOMBA_ACCOUNT_ID` | — | Nomba account ID for card-update SDK |
| `VITE_RECONCILIATION_ADMINS` | — | Comma-separated emails with reconciliation access. This is handled via env var because Orflow does not yet have a dedicated admin authentication system. A future admin roles implementation will replace this. |

### Solar-icons note

`@solar-icons/react` has a massive barrel export. This project uses direct-path imports through `src/lib/icons.ts` — a local barrel that imports each icon from its individual ESM file.

---

## Future Improvements

### Teams & Role-Based Access

- Invite team members to a project with roles (admin, developer, viewer)
- Each member has their own dashboard access scoped to assigned projects
- Activity audit log per project (who changed what)

### Additional Features

- **Multi-currency support** — Allow plans in different currencies within the same project
- **Coupons & discounts** — Percentage or fixed amount off, trial extensions
- **Invoice PDF generation** — Downloadable invoices for customers
- **Usage-based billing** — Metered billing for API-usage-based pricing models
- **Portal customization** — Custom branding for the self-service portal (logo, colors, domain)
- **Email templates** — Customizable email templates for portal access, invoices, dunning
- **API key expiry** — Set expiration dates on API keys for security compliance

---

## API

The backend lives at **[github.com/Team-Blueprint/orflow-backend](https://github.com/Team-Blueprint/orflow-backend)**.

## Docs

Full documentation (via Mintlify) is served at `/docs`.
