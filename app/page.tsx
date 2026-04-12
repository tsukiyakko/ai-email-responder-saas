import { SignUpButton } from '@clerk/nextjs';
import { Navbar } from '@/components/navbar';
import { ArrowRight, Zap, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <section className="px-4 md:px-8 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/50 rounded-full border border-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">
                AI でメール返信を自動化
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
              お客様へのメール返信を、
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                AIが瞬時に作成
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              3つの言語と3つの返信モードで、お客様に最適な返信文をAIが生成します。
              業務効率化はもちろん、顧客満足度の向上にも繋がります。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignUpButton mode="modal">
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2">
                  無料で試す
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
              <Link
                href="/pricing"
                className="px-8 py-4 border border-gray-300 text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors"
              >
                プラン詳細を見る
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              クレジットカード不要で今すぐ始められます
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 md:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              こんなことができます
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="p-3 w-fit bg-indigo-100 rounded-lg mb-4">
                  <Globe className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  3言語対応
                </h3>
                <p className="text-gray-600">
                  日本語、英語、中国語の3言語で返信文を同時生成。グローバルなお客様対応も簡単です。
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="p-3 w-fit bg-indigo-100 rounded-lg mb-4">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  3つの返信モード
                </h3>
                <p className="text-gray-600">
                  簡潔、丁寧、お詫びの3モードから、状況に合わせて最適な返信スタイルを選択。
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="p-3 w-fit bg-indigo-100 rounded-lg mb-4">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  AI が文脈を理解
                </h3>
                <p className="text-gray-600">
                  Gemini 3 Flash により、顧客の要望や感情を読み取った自然な返信を生成します。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section className="px-4 md:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              シンプルな料金体系
            </h2>
            <p className="text-center text-gray-600 mb-16">
              無料トライアルから始めて、必要に応じてアップグレード
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Trial Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-2xl font-bold mb-2">無料トライアル</h3>
                <p className="text-gray-600 mb-6">
                  最初の1日間、気軽にお試しください
                </p>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900">無料</div>
                  <p className="text-gray-600">1日間のみ</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700">最大 2 回の生成</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700">3 言語対応</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700">3 つの返信モード</span>
                  </li>
                </ul>
                <SignUpButton mode="modal">
                  <button className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                    無料で始める
                  </button>
                </SignUpButton>
              </div>

              {/* Standard Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-300 p-8 ring-2 ring-indigo-500 relative">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg font-bold text-sm">
                  人気
                </div>
                <h3 className="text-2xl font-bold mb-2">Standard</h3>
                <p className="text-gray-700 mb-6">
                  本格的に利用する方向け
                </p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-indigo-600">$5</span>
                    <span className="text-gray-700">/月</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-900 font-medium">
                      1 日あたり 30 回の生成
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-900 font-medium">3 言語対応</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-900 font-medium">
                      3 つの返信モード
                    </span>
                  </li>
                </ul>
                <SignUpButton mode="modal">
                  <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                    今すぐアップグレード
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-8 py-20">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              メール返信の効率化を今すぐ始めましょう
            </h2>
            <p className="text-lg opacity-90">
              1 日無料で試すことができます。クレジットカード不要です。
            </p>
            <SignUpButton mode="modal">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                無料で試す
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignUpButton>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-4 md:px-8 py-8">
          <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
            <p>© 2024 AI Email Responder. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
