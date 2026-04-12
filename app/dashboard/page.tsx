'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { EmailForm } from '@/components/email-form';
import { useAuth } from '@clerk/nextjs';

interface UsageData {
  type: 'trial' | 'standard';
  used: number;
  total: number;
}

export default function DashboardPage() {
  const { userId } = useAuth();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const initializeAndFetchUsage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/usage');

        if (!response.ok) {
          throw new Error('Failed to fetch usage data');
        }

        const data = await response.json();
        setUsageData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching usage:', err);
        setError('使用状況の取得に失敗しました');
        setUsageData({
          type: 'trial',
          used: 0,
          total: 2,
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAndFetchUsage();
  }, [userId]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </>
    );
  }

  if (!usageData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-gray-600">{error || 'エラーが発生しました'}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <EmailForm
        initialUsageType={usageData.type}
        initialUsed={usageData.used}
        initialTotal={usageData.total}
      />
    </>
  );
}
