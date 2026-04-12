import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-15.acacia',
});

export async function createCheckoutSession(
  userId: string,
  email: string
): Promise<string> {
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!priceId) {
    throw new Error('STRIPE_PRICE_ID is not set');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    customer_email: email,
    metadata: {
      userId,
    },
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  return session.url;
}

export async function getSubscriptionStatus(
  customerId: string
): Promise<'active' | 'inactive' | 'none'> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    return subscriptions.data.length > 0 ? 'active' : 'inactive';
  } catch {
    return 'none';
  }
}
