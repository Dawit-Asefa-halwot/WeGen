# WeGen Platform - Ethiopian Crowdfunding, Giving & Organization Platform

[![Node Version](https://img.shields.io/badge/node-%3E%3D22.0.0-emerald.svg)](https://nodejs.org/)
[![pnpm Workspaces](https://img.shields.io/badge/pnpm-workspaces-blue.svg)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4.15-red.svg)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.0-darkblue.svg)](https://www.prisma.io/)

WeGen is a production-ready Ethiopian crowdfunding, giving, referral, and organization fundraising platform. The platform connects individuals in financial need, compassionate referrers, donors, NGOs, charities, and community organizations with verified trust and complete financial transparency.

---

## 1. Core Architecture & Monorepo Structure

WeGen is built as a monorepo using `pnpm` workspaces:

```
wegen/
├── apps/
│   ├── web/                     # Next.js 15 App Router Frontend (Tailwind CSS, shadcn/ui, PWA)
│   └── api/                     # NestJS Backend REST API (TypeScript, Passport JWT, BullMQ)
│
├── packages/
│   ├── types/                   # Shared TypeScript interfaces & domain enums
│   ├── validation/              # Shared Zod validation DTO schemas
│   └── config/                  # Shared TSConfig & ESLint presets
│
├── prisma/
│   ├── schema.prisma            # PostgreSQL Database Schema & Relational Models
│   └── seed.ts                  # Database Seeding Script (Roles, Categories, Plans, Admin)
│
├── .env.example                 # Documented environment variables blueprint
├── docker-compose.yml           # Local PostgreSQL 16 & Redis 7 containers
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## 2. Key Business & Security Architecture

### A. Business Model Rules
- **Personal & Referral Campaigns**: Subject to a **10% WeGen Platform Fee** deducted upon successful donation capture (e.g., 1,000 ETB donation => 100 ETB Platform Fee, 900 ETB net available for beneficiary).
- **Organization Campaigns**: Organizations subscribe via a monthly/yearly rental plan. Organization campaigns carry **0% campaign fee deduction** on donations.

### B. Money Representation
- Financial amounts are strictly represented in **integer minor units** (Cents / 1 ETB = 100 Cents).
- All financial operations use atomic database transactions (`prisma.$transaction`) to update donation records, campaign totals, and immutable double-entry ledger entries simultaneously.

### C. Verification Safeguards
- Campaign Lifecycle: `DRAFT` ➔ `SUBMITTED` ➔ `UNDER_REVIEW` ➔ `MORE_INFO_REQUIRED` ➔ `VERIFIED` ➔ `PUBLISHED` ➔ `FUNDING` ➔ `WITHDRAWAL_REQUESTED` ➔ `COMPLETED`.
- Private verification files (National ID, Medical Records, Tax Certificates) are kept in private object storage and accessed **only via temporary Hmac SHA-256 pre-signed URLs**.

### D. Payment Provider Abstraction
- Unified `IPaymentProvider` adapter interface supporting Chapa Payment Gateway (Ethio Telecom Telebirr / Cards) and a local development `MockPaymentProvider`.
- Idempotent webhook processing via `PaymentEvent` table to prevent duplicate donation records or replay attacks.

---

## 3. Quick Start & Local Development

### Prerequisites
- **Node.js**: `v22.0.0+`
- **pnpm**: `v10.0.0+`
- **Docker Desktop** (optional, for local PostgreSQL & Redis)

### Step 1: Install Workspace Dependencies
```bash
pnpm install
```

### Step 2: Start PostgreSQL & Redis
```bash
docker-compose up -d
```

### Step 3: Run Database Migrations & Seed Data
```bash
# Generate Prisma Client
pnpm prisma:generate

# Apply migrations
pnpm prisma:migrate

# Seed initial roles, categories, subscription plans, and admin account
pnpm prisma:seed
```

### Step 4: Start Applications in Development Mode
```bash
# Start both NestJS API (port 4000) and Next.js Web (port 3000)
pnpm dev
```

Alternatively, start services individually:
```bash
pnpm dev:api    # Start NestJS API on http://localhost:4000
pnpm dev:web    # Start Next.js App on http://localhost:3000
```

---

## 4. API Endpoints & Swagger Documentation

When running `apps/api`, interactive Swagger OpenAPI documentation is available at:
👉 **`http://localhost:4000/api/docs`**

### Key REST API Routes:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User authentication & JWT generation
- `GET /api/v1/campaigns/discover` - Campaign search & discovery
- `POST /api/v1/campaigns` - Guided campaign submission
- `POST /api/v1/donations` - Create one-time donation
- `POST /api/v1/payments/initiate` - Initiate Chapa/Mock payment
- `POST /api/v1/payments/webhook/:providerCode` - Idempotent payment webhook
- `GET /api/v1/verification/queue` - Admin verification review queue
- `POST /api/v1/withdrawals/request` - Beneficiary withdrawal request
- `GET /api/v1/admin/overview` - Admin statistics overview

---

## 5. Production Build & Deployment

### Build Workspace Packages
```bash
pnpm build
```

### Deployment Strategy
1. **Frontend (`apps/web`)**: Deploy to Vercel or AWS Amplify. Set environment variable `NEXT_PUBLIC_API_URL=https://api.wegen.et/api/v1`.
2. **Backend (`apps/api`)**: Deploy NestJS API build (`apps/api/dist/main.js`) to AWS ECS, DigitalOcean App Platform, or a Linux VPS using PM2 / Docker.
3. **Database**: Managed PostgreSQL (AWS RDS / Supabase / Render).
4. **Storage**: Cloudflare R2 / AWS S3 bucket configured for private document presigning.

---

## 6. Seed Accounts for Testing

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@wegen.et` | `AdminWeGen2026!` |
| **Fundraiser** | `fundraiser@wegen.et` | `Fundraiser2026!` |
| **Organization Admin** | `contact@redcross.et` | `OrgPass2026!` |

---

## 7. License

Copyright © 2026 WeGen Platform. All rights reserved.
