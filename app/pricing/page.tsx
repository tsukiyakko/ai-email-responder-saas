import { SignUpButton } from '@clerk/nextjs';
import { Navbar } from '@/components/navbar';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <section className="px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              シンプルで透明な料金
            </h1>
            <p className="text-xl text-gray-600">
              どのプランでも、品質の高い AI 返信を体験できます
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 md:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Trial Plan */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10 shadow-sm hover:shadow-lg transition-shadow">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                    無料トライアル
                  </h2>
                  <p className="text-gray-600 mb-6">
                    新規ユーザー向けの無料プランです。<br />
                    サービスをお試しいただけます。
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900">無料</span>
                    </div>
                    <p className="text-gray-500 text-sm">1 日間のご利用可能</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      何ができる？
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          1 日あたり最大<span className="font-bold">2 回</span>
                          のメール返信を生成
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          日本語、英語、中国語の
                          <span className="font-bold">3 言語対応</span>
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          簡潔、丁寧、お詫びの
                          <span className="font-bold">3 つの返信モード</span>
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          企業名や担当者名を指定可能
                        </span>
                      </li>
                    </ul>
                  </div>

                  <SignUpButton mode="modal">
                    <button className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                      無料で始める
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </SignUpButton>

                  <p className="text-xs text-gray-500 text-center">
                    クレジットカード不要
                  </p>
                </div>
              </div>

              {/* Standard Plan */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-500 p-8 md:p-10 ring-2 ring-indigo-500 ring-offset-4 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap">
                  おすすめ
                </div>

                <div className="mb-8 pt-4">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                    Standard プラン
                  </h2>
                  <p className="text-gray-700 mb-6">
                    本格的に利用する方向けのプランです。<br />
                    毎日、たくさんのメール返信が生成できます。
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-indigo-600">$5</span>
                      <span className="text-gray-600">/ 月</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      年払いの場合は $48/年（10%割引）
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      何ができる？
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5 font-bold" />
                        <span className="text-gray-800">
                          1 日あたり最大<span className="font-bold">30 回</span>
                          のメール返信を生成
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5 font-bold" />
                        <span className="text-gray-800">
                          日本語、英語、中国語の
                          <span className="font-bold">3 言語対応</span>
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5 font-bold" />
                        <span className="text-gray-800">
                          簡潔、丁寧、お詫びの
                          <span className="font-bold">3 つの返信モード</span>
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5 font-bold" />
                        <span className="text-gray-800">
                          企業名や担当者名を指定可能
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5 font-bold" />
                        <span className="text-gray-800">
                          優先サポート対応
                        </span>
                      </li>
                    </ul>
                  </div>

                  <SignUpButton mode="modal">
                    <button className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      今すぐアップグレード
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </SignUpButton>

                  <p className="text-xs text-gray-600 text-center">
                    30 日以内のキャンセル可能
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 md:px-8 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              よくある質問
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: 'トライアル期間中にキャンセルできますか？',
                  a: 'はい、いつでもキャンセルできます。トライアル期間中に課金されることはありません。',
                },
                {
                  q: 'クレジットカードの登録は必須ですか？',
                  a: 'トライアルの利用にはクレジットカードは不要です。Standard プランへのアップグレード時にのみ必要です。',
                },
                {
                  q: 'サブスクリプションをキャンセルしたい場合は？',
                  a: 'いつでもキャンセルできます。ダッシュボードの設定ページから、または弊社サポートまでお気軽にお問い合わせください。',
                },
                {
                  q: 'API は提供されていますか？',
                  a: '現在のところ API は提供していません。将来的な提供を検討中です。',
                },
                {
                  q: '生成されたメール返信の品質について保証はありますか？',
                  a: 'AI により生成されたテキストのため、必ず内容をご確認の上、送信してください。生成内容については自己責任でご利用ください。',
                },
                {
                  q: 'ビジネス用途で利用できますか？',
                  a: 'はい、ビジネス用途での利用を想定しています。ただし、利用規約に同意いただく必要があります。',
                },
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
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
