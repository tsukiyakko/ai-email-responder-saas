import { auth } from '@clerk/nextjs/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import {
  canGenerate,
  incrementUsage,
  incrementTrialTotal,
  getRemaining,
  getSubscriptionStatus,
} from '@/lib/redis';
import { generateReply, type ReplyMode, type Language } from '@/lib/gemini';
import { NextResponse } from 'next/server';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Upstash Redis environment variables');
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
});

interface GenerateRequest {
  customerEmail: string;
  companyName?: string;
  senderName?: string;
  notes?: string;
  mode: ReplyMode;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success } = await ratelimit.limit(userId);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait before trying again.',
          message: 'リクエストが多すぎます。少し待ってからもう一度試してください。',
        },
        { status: 429 }
      );
    }

    const body: GenerateRequest = await req.json();

    const canGenerateResult = await canGenerate(userId);

    if (!canGenerateResult.allowed) {
      let message = 'Cannot generate at this time.';
      let reason = 'unknown';

      if (canGenerateResult.reason === 'upgrade_required') {
        message = 'アップグレードが必要です。';
        reason = 'upgrade_required';
      } else if (canGenerateResult.reason === 'trial_expired') {
        message = '無料トライアル期間が終了しました。';
        reason = 'trial_expired';
      } else if (canGenerateResult.reason === 'trial_limit_exceeded') {
        message = '今日の無料生成回数に達しました。';
        reason = 'trial_limit_exceeded';
      } else if (canGenerateResult.reason === 'daily_limit_exceeded') {
        message = '本日の生成上限に達しました。';
        reason = 'daily_limit_exceeded';
      }

      return NextResponse.json(
        {
          error: message,
          message: message,
          reason: reason,
        },
        { status: 403 }
      );
    }

    const languages: Language[] = ['ja', 'en', 'zh'];

    const replies = await Promise.all(
      languages.map((lang) =>
        generateReply({
          customerEmail: body.customerEmail,
          companyName: body.companyName,
          senderName: body.senderName,
          notes: body.notes,
          mode: body.mode,
          language: lang,
        })
      )
    );

    const status = await getSubscriptionStatus(userId);

    if (status === 'trial') {
      await incrementTrialTotal(userId);
    } else {
      await incrementUsage(userId);
    }

    const remaining = await getRemaining(userId);

    return NextResponse.json({
      replies: {
        ja: replies[0],
        en: replies[1],
        zh: replies[2],
      },
      remaining: {
        remaining: remaining,
        used: status === 'trial' ? canGenerateResult.remaining - 1 : -1,
        total: status === 'trial' ? 2 : 30,
        type: status === 'trial' ? 'trial' : 'standard',
      },
    });
  } catch (error) {
    console.error('Generate API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request body', message: 'リクエスト形式が無効です。' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to generate reply',
        message: '返信の生成に失敗しました。もう一度お試しください。',
      },
      { status: 500 }
    );
  }
}
