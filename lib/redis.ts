import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Upstash Redis environment variables');
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TRIAL_DAYS = 1;
const TRIAL_MAX_GENERATIONS = 2;
const STANDARD_MAX_GENERATIONS_PER_DAY = 30;

function getTodayKey(userId: string): string {
  const today = new Date().toISOString().split('T')[0];
  return `usage:${userId}:${today}`;
}

export async function getUsageToday(userId: string): Promise<number> {
  const key = getTodayKey(userId);
  const count = await redis.get<number>(key);
  return count ?? 0;
}

export async function incrementUsage(userId: string): Promise<void> {
  const key = getTodayKey(userId);
  await redis.incr(key);
  await redis.expire(key, 86400);
}

export async function getTrialTotal(userId: string): Promise<number> {
  const key = `trial:${userId}:total`;
  const count = await redis.get<number>(key);
  return count ?? 0;
}

export async function incrementTrialTotal(userId: string): Promise<void> {
  const key = `trial:${userId}:total`;
  const current = await redis.get<number>(key);
  const newValue = (current ?? 0) + 1;
  await redis.set(key, newValue);
}

export async function getSubscriptionStatus(
  userId: string
): Promise<'active' | 'trial' | 'expired' | 'none'> {
  const status = await redis.get<string>(`subscription:${userId}`);
  return (status as 'active' | 'trial' | 'expired' | 'none') ?? 'none';
}

export async function setSubscriptionActive(userId: string): Promise<void> {
  await redis.set(`subscription:${userId}`, 'active');
}

export async function setSubscriptionNone(userId: string): Promise<void> {
  await redis.set(`subscription:${userId}`, 'none');
}

export async function initTrial(userId: string): Promise<void> {
  const status = await getSubscriptionStatus(userId);

  if (status === 'none') {
    await redis.set(`subscription:${userId}`, 'trial');
    await redis.set(`trial_start:${userId}`, new Date().toISOString());
  }
}

export async function isTrialExpired(userId: string): Promise<boolean> {
  const trialStart = await redis.get<string>(`trial_start:${userId}`);

  if (!trialStart) {
    return false;
  }

  const startDate = new Date(trialStart);
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= TRIAL_DAYS;
}

export async function canGenerate(
  userId: string
): Promise<{ allowed: boolean; reason?: string; remaining: number }> {
  const status = await getSubscriptionStatus(userId);

  if (status === 'none') {
    return {
      allowed: false,
      reason: 'upgrade_required',
      remaining: 0,
    };
  }

  if (status === 'trial') {
    const isExpired = await isTrialExpired(userId);
    if (isExpired) {
      return {
        allowed: false,
        reason: 'trial_expired',
        remaining: 0,
      };
    }

    const trialTotal = await getTrialTotal(userId);
    if (trialTotal >= TRIAL_MAX_GENERATIONS) {
      return {
        allowed: false,
        reason: 'trial_limit_exceeded',
        remaining: 0,
      };
    }

    return {
      allowed: true,
      remaining: TRIAL_MAX_GENERATIONS - trialTotal,
    };
  }

  if (status === 'active') {
    const todayUsage = await getUsageToday(userId);
    if (todayUsage >= STANDARD_MAX_GENERATIONS_PER_DAY) {
      return {
        allowed: false,
        reason: 'daily_limit_exceeded',
        remaining: 0,
      };
    }

    return {
      allowed: true,
      remaining: STANDARD_MAX_GENERATIONS_PER_DAY - todayUsage,
    };
  }

  return {
    allowed: false,
    reason: 'unknown',
    remaining: 0,
  };
}

export async function getRemaining(userId: string): Promise<number> {
  const status = await getSubscriptionStatus(userId);

  if (status === 'trial') {
    const trialTotal = await getTrialTotal(userId);
    return Math.max(0, TRIAL_MAX_GENERATIONS - trialTotal);
  }

  if (status === 'active') {
    const todayUsage = await getUsageToday(userId);
    return Math.max(0, STANDARD_MAX_GENERATIONS_PER_DAY - todayUsage);
  }

  return 0;
}

export { redis };
