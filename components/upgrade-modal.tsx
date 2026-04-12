'use client';

import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'trial_expired' | 'trial_limit_exceeded' | 'daily_limit_exceeded';
}

export function UpgradeModal({ isOpen, onClose, reason }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const messages = {
    trial_expired: {
      title: '無料トライアル期間が終了しました',
      description: 'さらに利用するには、Standard プランにアップグレードしてください。',
    },
    trial_limit_exceeded: {
      title: '今日の無料生成回数に達しました',
      description: '2回の無料生成を使い切りました。Standard プランにアップグレードすると、1日あたり30回の生成が可能になります。',
    },
    daily_limit_exceeded: {
      title: '本日の生成上限に達しました',
      description: '1日の最大生成回数（30回）に達しました。明日になるとリセットされます。',
    },
  };

  const message = messages[reason];

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('チェックアウトセッションの作成に失敗しました');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('アップグレードに失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{message.title}</h2>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-600">{message.description}</p>

          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <p className="text-sm font-semibold text-indigo-900 mb-2">Standard プラン</p>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-bold text-indigo-600">$5</span>
              <span className="text-gray-600">/月</span>
            </div>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold">✓</span>
                1日あたり30回の生成
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold">✓</span>
                3言語対応
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold">✓</span>
                3つの返信モード
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              キャンセル
            </button>
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'リダイレクト中...' : 'アップグレード'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
