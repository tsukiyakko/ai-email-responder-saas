'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 hidden sm:inline">AI Email Responder</span>
        </Link>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                ダッシュボード
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/sign-up"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                無料で試す
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
