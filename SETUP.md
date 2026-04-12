# AI Email Responder SaaS - Setup Guide

## Quick Start

This is a complete, production-ready Next.js 14 SaaS application. All source code is ready to use - just configure your API keys and run.

### 1. Get Your API Keys

#### Clerk Authentication (Free)
1. Visit https://clerk.com and create account
2. Create a new application
3. Go to API Keys and copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

#### Google Gemini API (Free tier available)
1. Visit https://aistudio.google.com
2. Create new API key
3. Copy `GEMINI_API_KEY`

#### Upstash Redis (Free tier: 10,000 commands/day)
1. Visit https://upstash.com
2. Create new Redis database
3. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

#### Stripe (Free tier)
1. Visit https://stripe.com
2. Create account and go to dashboard
3. In Products section, create a recurring product:
   - Name: "Standard Plan"
   - Price: $5/month
   - Billing period: Monthly
4. Copy the Price ID to `STRIPE_PRICE_ID`
5. Go to API Keys and copy:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
6. Go to Webhooks and create endpoint:
   - URL: `https://yourdomain.com/api/stripe/webhook` (use ngrok for testing)
   - Subscribe to: `checkout.session.completed`, `customer.subscription.deleted`
   - Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### 2. Configure Environment

1. Copy example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in all keys from step 1

3. Keep `NEXT_PUBLIC_APP_URL=http://localhost:3000` for local testing

### 3. Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000

### 4. Test the Application

**Landing Page**
- Visit http://localhost:3000
- See pricing and features

**Sign Up**
- Click "無料で試す" button
- Create account via Clerk
- Auto-initializes 1-day trial

**Try Free Trial**
- Go to Dashboard (auto-redirects after sign-up)
- You'll have 2 free email generations
- Enter sample email and click "返信文を生成する"
- See generated responses in 3 languages

**Test Upgrade Flow**
- Use 2 generations (fills trial limit)
- Try to generate 3rd email
- Click "アップグレード" in modal
- Stripe checkout loads (test mode)
- Use Stripe test card: 4242 4242 4242 4242

**Subscription Active**
- After successful payment, standard user can generate 30 emails/day
- Usage counter shows remaining generations
- Resets daily

### 5. Local Testing with Stripe Webhooks

For testing Stripe webhooks locally:

```bash
# In separate terminal, install stripe CLI
# https://stripe.com/docs/stripe-cli

stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook signing secret and add to .env.local
```

## File Overview

### Core Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `middleware.ts` - Clerk authentication middleware

### Pages
- `app/page.tsx` - Landing page with marketing content
- `app/(auth)/sign-in/[[...sign-in]]/page.tsx` - Clerk sign-in page
- `app/(auth)/sign-up/[[...sign-up]]/page.tsx` - Clerk sign-up page
- `app/pricing/page.tsx` - Pricing page with plan details
- `app/dashboard/page.tsx` - Main app (protected, shows email form)

### API Routes
- `app/api/generate/route.ts` - Email generation (rate-limited, usage-tracked)
- `app/api/usage/route.ts` - Get current user usage stats
- `app/api/stripe/checkout/route.ts` - Create Stripe checkout session
- `app/api/stripe/webhook/route.ts` - Stripe webhook handler

### Components
- `components/navbar.tsx` - Top navigation with auth buttons
- `components/email-form.tsx` - Main UI (3 language tabs, 3 modes, copy button)
- `components/usage-display.tsx` - Usage progress bar
- `components/upgrade-modal.tsx` - Upgrade prompt modal

### Libraries
- `lib/gemini.ts` - Google Gemini API integration
- `lib/redis.ts` - Redis usage tracking & subscription management
- `lib/stripe.ts` - Stripe payment integration

### Styling
- `app/globals.css` - Global styles and Tailwind directives
- `tailwind.config.ts` - Tailwind theme configuration

## Key Features Explained

### Trial System
- Auto-initialized on first sign-in (1 day expiry)
- Max 2 email generations total
- After expired or limit reached, user must upgrade
- Trial state stored in Redis with `trial_start:{userId}` and `trial:{userId}:total`

### Usage Tracking
- **Trial users**: Tracked globally (2 total generations)
- **Paid users**: Tracked daily (30 per day)
- Redis keys: `usage:{userId}:{YYYY-MM-DD}` and auto-expire after 24h

### Rate Limiting
- 5 requests per 10 minutes per user (Upstash Ratelimit)
- Applied to `/api/generate` only
- Prevents abuse without blocking legitimate use

### Email Generation
- 3 languages generated in parallel (Japanese, English, Chinese)
- 3 tone modes: Concise, Polite, Apologetic
- Optional context: company name, sender name, special notes
- All done server-side (Gemini API key never exposed to client)

### Subscription Management
- Stripe checkout creates session with user metadata
- On payment completion, webhook updates Redis `subscription:{userId}` to "active"
- On cancellation, webhook updates to "none"
- Usage limits enforced based on subscription status

## Deployment Checklist

### Before Going Live

1. **Test Fully**
   - Sign up flow
   - Email generation with all 3 modes
   - Usage limit enforcement
   - Trial expiration
   - Stripe payment flow
   - Webhook handling

2. **Prepare Stripe**
   - Switch to live API keys in `.env.local`
   - Update webhook URLs to production domain
   - Test live payment processing
   - Verify webhook signing secret is correct

3. **Configure DNS**
   - If using custom domain, update Clerk allowed origins
   - Ensure HTTPS is enabled (required for Stripe)
   - Update `NEXT_PUBLIC_APP_URL` environment variable

4. **Security Review**
   - Verify API keys are NOT in version control
   - Use `.env.local` (local only) and platform env vars (production)
   - All sensitive operations are server-side only
   - Middleware properly protects `/dashboard` route

5. **Performance**
   - Redis connections are pooled efficiently
   - API routes are lightweight
   - Gemini calls are parallelized
   - Assets are optimized by Next.js

### Deployment to Vercel

1. Push code to GitHub (without `.env.local`)
2. Connect repository to Vercel project
3. In Vercel dashboard → Settings → Environment Variables, add all variables from `.env.local`
4. Deploy
5. Update Stripe webhook URL to Vercel domain
6. Update Clerk allowed origins to Vercel domain

### Deployment to Other Platforms

Ensure:
- Node.js 18+ runtime
- Environment variables configured in platform settings
- Webhook endpoints updated (Stripe, Clerk)
- HTTPS enabled
- Vercel Analytics (optional) or equivalent

## Common Issues & Solutions

### "No usage data" error
- Check Redis connection in `.env.local`
- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Redis token may have expired (regenerate on Upstash)

### Stripe webhook not firing
- Ensure webhook signing secret is in `STRIPE_WEBHOOK_SECRET`
- Check webhook endpoint URL is correct
- Use `stripe listen` locally to test
- In production, verify URL is HTTPS and reachable

### Clerk sign-in not working
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Check authorized origins in Clerk dashboard
- Clear browser cookies and try again

### Gemini API errors
- Verify `GEMINI_API_KEY` is valid
- Check quota on Google AI Studio
- Ensure model name is `gemini-2.0-flash`

### Cannot generate replies (403 error)
- Check usage in Redis
- For trial users: max 2 total
- For paid users: max 30 per day
- Check subscription status with GET `/api/usage`

## Development Tips

### Hot Reload
- Automatic on code changes during `npm run dev`
- CSS changes reload instantly
- TypeScript errors appear in terminal and browser

### Debugging
- Use browser DevTools for client-side issues
- Check server logs in terminal for API errors
- Use `console.error()` in API routes for debugging

### Testing Modes
- Clerk test mode allows creating test users
- Stripe test card: 4242 4242 4242 4242
- Redis data persists between restarts (use Upstash console to clear)

### Code Organization
- Pages are in `app/` with file-based routing
- API routes in `app/api/`
- Reusable components in `components/`
- Shared utilities in `lib/`
- All TypeScript with strict mode enabled

## Next Steps

1. Get API keys from services above
2. Configure `.env.local`
3. Run `npm install && npm run dev`
4. Test the full user flow
5. Deploy to Vercel or your platform
6. Set up monitoring/logging

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- Clerk Docs: https://clerk.com/docs
- Stripe Docs: https://stripe.com/docs
- Gemini API Docs: https://ai.google.dev
- Upstash Redis Docs: https://upstash.com/docs

## Architecture Notes

This SaaS uses a scalable, serverless-first architecture:

- **Stateless API routes** - Scale horizontally on Vercel
- **Redis for state** - No database migrations needed
- **Client-side validation** - Reduce server load
- **Server-side AI calls** - Secure API key handling
- **Webhook-driven billing** - No polling needed

All components are production-ready with proper error handling, TypeScript types, and security considerations.
