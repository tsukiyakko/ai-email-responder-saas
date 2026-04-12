import { auth } from '@clerk/nextjs/server';
import {
  getSubscriptionStatus,
  getUsageToday,
  getTrialTotal,
  isTrialExpired,
  initTrial,
} from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initTrial(userId);

    const status = await getSubscriptionStatus(userId);

    if (status === 'trial') {
      const expired = await isTrialExpired(userId);

      if (expired) {
        return NextResponse.json({
          type: 'trial',
          used: 0,
          total: 0,
          status: 'expired',
        });
      }

      const trialTotal = await getTrialTotal(userId);
      return NextResponse.json({
        type: 'trial',
        used: trialTotal,
        total: 2,
        status: 'active',
      });
    }

    if (status === 'active') {
      const todayUsage = await getUsageToday(userId);
      return NextResponse.json({
        type: 'standard',
        used: todayUsage,
        total: 30,
        status: 'active',
      });
    }

    return NextResponse.json({
      type: 'trial',
      used: 0,
      total: 2,
      status: 'none',
    });
  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
