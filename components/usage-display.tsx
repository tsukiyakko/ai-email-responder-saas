'use client';

interface UsageDisplayProps {
  used: number;
  total: number;
  type: 'trial' | 'standard';
}

export function UsageDisplay({ used, total, type }: UsageDisplayProps) {
  const remaining = Math.max(0, total - used);
  const percentage = Math.min(100, (used / total) * 100);

  const labels = {
    trial: {
      title: '無料トライアル',
      format: (n: number) => `あと${n}回使えます`,
    },
    standard: {
      title: '本日の使用状況',
      format: (n: number) => `本日の残り: ${n}回`,
    },
  };

  const label = labels[type];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-900">{label.title}</p>
        <p className="text-sm font-bold text-indigo-600">{label.format(remaining)}</p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            remaining === 0 ? 'bg-red-500' : 'bg-indigo-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {used} / {total} 使用済み
      </p>
    </div>
  );
}
