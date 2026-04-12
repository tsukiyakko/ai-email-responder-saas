import { auth } from '@clerk/nextjs/server';
import { createCheckoutSession } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await (
      await import('@clerk/nextjs/server')
    ).clerkClient.users.getUser(userId);

    const email = user.emailAddresses[0]?.emailAddress || '';

    if (!email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    const checkoutUrl = await createCheckoutSession(userId, email);

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
