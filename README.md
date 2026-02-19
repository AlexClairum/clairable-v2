# Clairable - AI Adoption Enablement Platform

Helps organizations get ROI from AI tools they already own (Copilot, ChatGPT, etc.) by helping employees discover role-specific use cases, try them, and track what works.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Clerk (with Organizations)
- **Hosting**: Vercel

## Setup

1. Clone and install:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Configure:
   - [Clerk](https://clerk.com): Create an application with Organizations enabled. Add keys to `.env.local`.
   - [Supabase](https://supabase.com): Create a project. Run the schema in `supabase/migrations/001_initial_schema.sql`. Add keys to `.env.local`.
   - Set `CLERK_WEBHOOK_SIGNING_SECRET` from Clerk Dashboard → Webhooks. Add endpoint: `https://your-domain.com/api/webhooks/clerk` with events: `organization.created`, `user.created`, `organizationMembership.created`.

4. Seed use cases (after Supabase is configured):
   ```bash
   npm run seed
   ```

5. **Important**: `npm run build` requires valid Clerk and Supabase env vars. Use real keys from your Clerk and Supabase dashboards.

6. Run:
   ```bash
   npm run dev
   ```

## Routes

- `/` - Landing
- `/sign-in`, `/sign-up` - Auth
- `/get-started` - Path choice (individual vs team)
- `/create-org` - Create organization (team path)
- `/onboarding` - Org setup (admin)
- `/welcome` - User onboarding (role, priorities)
- `/dashboard` - Use case discovery
- `/admin` - Admin metrics
- `/admin/invite` - Invite team
- `/upgrade` - Individual → org conversion
