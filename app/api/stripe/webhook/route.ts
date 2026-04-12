import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { setSubscriptionActive, setSubscriptionNone } from '@/lib/redis';
import { NextResponse } from 'next/server';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

interface StripeWebhookEvent {
  type: string;
  data: {
    object: {
      id?: string;
      metadata?: {
        userId?: string;
      };
      customer?: string;
    };
  };
}

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = await headers();
  const svix_id = headersList.get('svix-id');
  const svix_timestamp = headersList.get('svix-timestamp');
  const svix_signature = headersList.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Error occurred -- no svix headers' },
      { status: 400 }
    );
  }

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook secret is not set' },
      { status: 500 }
    );
  }

  const wh = new Webhook(webhookSecret);

  let evt: StripeWebhookEvent;
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as StripeWebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Error occurred' }, { status: 400 });
  }

  const eventType = evt.type;

  try {
    if (eventType === 'checkout.session.completed') {
      const userId = evt.data.object.metadata?.userId;

      if (!userId) {
        console.error('No userId in metadata');
        return NextResponse.json(
          { error: 'No userId in metadata' },
          { status: 400 }
        );
      }

      await setSubscriptionActive(userId);
      console.log(`Subscription activated for user: ${userId}`);
    } else if (eventType === 'customer.subscription.deleted') {
      const customerId = evt.data.object.customer;

      if (!customerId) {
        console.error('No customer ID in event');
        return NextResponse.json(
          { error: 'No customer ID in event' },
          { status: 400 }
        );
      }

      const userId = evt.data.object.metadata?.userId;

      if (userId) {
        await setSubscriptionNone(userId);
        console.log(`Subscription deleted for user: ${userId}`);
      }
    }

    return NextResponse.json({ result: { ok: true } }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
