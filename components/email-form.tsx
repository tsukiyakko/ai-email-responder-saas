'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Copy,
  Check,
  RefreshCw,
  Languages,
  User,
  Building2,
  MessageSquareText,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import type { ReplyMode, Language } from '@/lib/gemini';
import { UsageDisplay } from './usage-display';
import { UpgradeModal } from './upgrade-modal';

interface EmailFormProps {
  initialUsageType: 'trial' | 'standard';
  initialUsed: number;
  initialTotal: number;
  onUpgradeNeeded?: (reason: 'trial_expired' | 'trial_limit_exceeded' | 'daily_limit_exceeded') => void;
}

export function EmailForm({
  initialUsageType,
  initialUsed,
  initialTotal,
  onUpgradeNeeded,
}: EmailFormProps) {
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [notes, setNotes] = useState('');
  const [mode, setMode] = useState<ReplyMode>('polite');
  const [language, setLanguage] = useState<Language>('ja');
  const [replies, setReplies] = useState<Record<Language, string>>({
    ja: '',
    en: '',
    zh: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageType, setUsageType] = useState<'trial' | 'standard'>(initialUsageType);
  const [used, setUsed] = useState(initialUsed);
  const [total, setTotal] = useState(initialTotal);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<
    'trial_expired' | 'trial_limit_exceeded' | 'daily_limit_exceeded'
  >('trial_limit_exceeded');

  const handleGenerate = useCallback(async () => {
    if (!customerEmail.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail,
          companyName,
          senderName,
          notes,
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setUpgradeReason(data.reason || 'trial_limit_exceeded');
          setUpgradeModalOpen(true);
          onUpgradeNeeded?.(data.reason);
          setError(data.message || '利用限度に達しました');
          return;
        }

        if (response.status === 429) {
          setError('リクエストが多すぎます。少し待ってからもう一度試してください。');
          return;
        }

        setError(data.message || '返信の生成に失敗しました。もう一度お試しください。');
        return;
      }

      setReplies(data.replies);
      setUsed(data.remaining.used);
      setTotal(data.remaining.total);
      setUsageType(data.remaining.type);
    } catch (err) {
      setError('エラーが発生しました。もう一度お試しください。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [customerEmail, companyName, senderName, notes, mode, onUpgradeNeeded]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  AI Email Responder
                </h1>
              </div>
              <p className="text-gray-500 font-medium">
                お客様への返信文をAIがスマートに作成します
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Input & Config */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex items-center gap-2">
                  <MessageSquareText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h2 className="text-lg font-bold">受信メール</h2>
                    <p className="text-sm text-gray-500">
                      お客様から届いたメールをここに貼り付けてください
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <textarea
                    placeholder="お客様からのメール内容を入力..."
                    className="w-full min-h-[300px] resize-none border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent p-4 text-base leading-relaxed font-sans"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold">設定</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        企業名 (任意)
                      </label>
                      <input
                        type="text"
                        placeholder="例: 株式会社サンプル"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <User className="w-4 h-4 text-gray-400" />
                        担当者名 (任意)
                      </label>
                      <input
                        type="text"
                        placeholder="例: 山田 太郎"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Sparkles className="w-4 h-4 text-gray-400" />
                      備考・追加指示 (任意)
                    </label>
                    <textarea
                      placeholder="例: 明日の打ち合わせについても触れてほしい、返金不可であることを強調してほしい、など"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full min-h-[80px] resize-none border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-sans"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">返信モード</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['concise', 'polite', 'apology'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMode(m)}
                          className={`rounded-xl border-2 px-4 py-4 font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                            mode === m
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-100 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {mode === m && <Check className="w-4 h-4" />}
                          <span className="text-sm">
                            {m === 'concise' && '簡潔'}
                            {m === 'polite' && '丁寧'}
                            {m === 'apology' && 'お詫び'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-6 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                    onClick={handleGenerate}
                    disabled={isLoading || !customerEmail.trim()}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {isLoading ? '生成中...' : '返信文を生成する'}
                  </button>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}
                </div>
              </div>

              <UsageDisplay used={used} total={total} type={usageType} />
            </div>

            {/* Right Column: Output Tabs */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col min-h-[600px]">
                <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold">生成された返信</h2>
                  </div>
                  {replies[language] && (
                    <button
                      onClick={() => copyToClipboard(replies[language])}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? 'コピーしました' : 'コピー'}
                    </button>
                  )}
                </div>

                <div className="p-0 flex-1 flex flex-col">
                  <div className="px-6 pt-4 border-b border-gray-100 bg-white">
                    <div className="flex gap-2 border-b border-gray-100">
                      {(['ja', 'en', 'zh'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={`px-6 py-3 font-medium transition-all ${
                            language === lang
                              ? 'text-indigo-600 border-b-2 border-indigo-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {lang === 'ja' && '日本語'}
                          {lang === 'en' && 'English'}
                          {lang === 'zh' && '中文'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 relative p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={language + (isLoading ? '-loading' : '-ready')}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 p-6 overflow-auto"
                      >
                        {isLoading ? (
                          <div className="h-full flex flex-col items-center justify-center space-y-4 text-gray-400">
                            <div className="relative">
                              <div className="w-12 h-12 border-4 border-indigo-100 rounded-full animate-pulse"></div>
                              <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <p className="text-sm font-medium">
                              AIが最適な返信を考えています...
                            </p>
                          </div>
                        ) : replies[language] ? (
                          <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-800 font-sans">
                            {replies[language]}
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center space-y-3 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                            <MessageSquareText className="w-10 h-10 opacity-20" />
                            <p className="text-sm">
                              左側のボタンを押して返信を生成してください
                            </p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        reason={upgradeReason}
      />
    </>
  );
}
