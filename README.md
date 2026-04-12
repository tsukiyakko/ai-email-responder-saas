# AI Email Responder SaaS

A subscription-based Next.js 14 SaaS application that generates professional email replies in 3 languages using Google's Gemini AI.

## Features

- **Multi-language Support**: Generate replies in Japanese, English, and Chinese
- **Multiple Reply Modes**: Choose from concise, polite, or apologetic tones
- **Trial & Paid Plans**:
  - Free trial: 1 day, max 2 email generations
  - Standard: $5/month, max 30 generations per day
- **Real-time Usage Tracking**: Redis-based usage tracking and rate limiting
- **Secure Authentication**: Clerk for user authentication
- **Payment Processing**: Stripe for subscription management

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **AI**: Google Gemini 2.0 Flash
- **Auth**: Clerk
- **Payments**: Stripe
- **Database/Cache**: Upstash Redis
- **Rate Limiting**: Upstash Rate Limit
- **Animations**: Framer Motion
- **UI Components**: Lucide Icons

## Prerequisites

- Node.js 18+ and npm/yarn
- Clerk account and API keys
- Google Gemini API key
- Stripe account and API keys
- Upstash Redis account

## Environment Setup

1. Clone the repository and navigate to the project directory

2. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Fill in the environment variables in `.env.local`:

   **Clerk Authentication**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Get from Clerk dashboard
   - `CLERK_SECRET_KEY`: Get from Clerk dashboard

   **Google Gemini**
   - `GEMINI_API_KEY`: Get from Google AI Studio (https://aistudio.google.com)

   **Stripe**
   - `STRIPE_SECRET_KEY`: Get from Stripe dashboard
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Get from Stripe dashboard
   - `STRIPE_WEBHOOK_SECRET`: Get from Stripe dashboard webhooks
   - `STRIPE_PRICE_ID`: Create a recurring product in Stripe ($5/month)

   **Upstash Redis**
   - `UPSTASH_REDIS_REST_URL`: Get from Upstash console
   - `UPSTASH_REDIS_REST_TOKEN`: Get from Upstash console

   **App Configuration**
   - `NEXT_PUBLIC_APP_URL`: Set to `http://localhost:3000` for development

## Installation & Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── (auth)/                    # Auth routes (sign-in, sign-up)
├── dashboard/                 # Protected dashboard page
├── pricing/                   # Pricing page
├── api/
│   ├── generate/             # Email generation endpoint
│   ├── usage/                # Usage stats endpoint
│   └── stripe/               # Stripe checkout & webhook
├── layout.tsx                # Root layout with Clerk
├── page.tsx                  # Landing page
└── globals.css              # Global styles

components/
├── navbar.tsx               # Navigation bar
├── email-form.tsx          # Main email form component
├── usage-display.tsx       # Usage statistics display
└── upgrade-modal.tsx       # Upgrade prompt modal

lib/
├── gemini.ts               # Gemini API integration
├── redis.ts                # Redis client & usage tracking
└── stripe.ts               # Stripe client & helpers

middleware.ts               # Clerk auth middleware
```

## Key Workflows

### User Onboarding
1. User signs up via Clerk
2. Trial status initialized in Redis (1 day expiry)
3. Maximum 2 generations during trial period
4. Upgrade modal shown when limit reached

### Email Generation
1. User submits email details via form
2. Rate limited (5 requests per 10 minutes)
3. Subscription status checked
4. Gemini API generates replies in 3 languages
5. Usage counter incremented in Redis
6. Results returned to frontend with remaining count

### Subscription Management
1. User clicks upgrade button
2. Stripe checkout session created
3. After payment, webhook updates user subscription status
4. User gains 30 daily generations

## API Endpoints

### POST `/api/generate`
Generate email replies. Requires authentication.

**Request Body:**
```json
{
  "customerEmail": "string",
  "companyName": "string (optional)",
  "senderName": "string (optional)",
  "notes": "string (optional)",
  "mode": "concise|polite|apology"
}
```

**Response:**
```json
{
  "replies": {
    "ja": "Japanese reply",
    "en": "English reply",
    "zh": "Chinese reply"
  },
  "remaining": {
    "remaining": 29,
    "used": 1,
    "total": 30,
    "type": "standard"
  }
}
```

### GET `/api/usage`
Get current user's usage statistics. Requires authentication.

**Response:**
```json
{
  "type": "trial|standard",
  "used": 2,
  "total": 2,
  "status": "active|expired"
}
```

### POST `/api/stripe/checkout`
Create Stripe checkout session. Requires authentication.

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### POST `/api/stripe/webhook`
Webhook endpoint for Stripe events (checkout.session.completed, customer.subscription.deleted)

## Rate Limiting

- Global: 5 requests per 10 minutes per user (API generation)
- No limit on read operations (usage, pricing pages)

## Error Handling

- Trial expired: 403 with `trial_expired` reason
- Trial limit exceeded: 403 with `trial_limit_exceeded` reason
- Daily limit exceeded: 403 with `daily_limit_exceeded` reason
- Rate limit exceeded: 429 Too Many Requests
- Invalid email input: 400 Bad Request
- Unauthorized: 401 Unauthorized

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel and select the repository
3. Configure environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure the following:
- Node.js 18+ runtime
- Environment variables configured
- Webhook URLs updated in Stripe & Clerk dashboards

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Subscribe to events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Clerk Setup

1. In Clerk Dashboard, ensure:
   - Authorized origins include your domain
   - Redirect URLs configured for sign-in/sign-up
   - Webhook endpoint configured (optional, for advanced features)

## Development Notes

- All AI generation happens server-side only (security best practice)
- Gemini API key never exposed to client
- Redis is used for both usage tracking and rate limiting
- Trial expiration is checked on every generation attempt
- Trial users get separate usage buckets from paid users

## Support & Issues

For issues or questions:
1. Check the environment variables are correct
2. Verify API keys have proper permissions
3. Check Redis connection and token expiry
4. Review browser console for client-side errors
5. Check server logs for API errors

## License

All rights reserved.
