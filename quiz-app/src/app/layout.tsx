import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "안티그래비티 시험 플랫폼",
  description: "안전보건교육 시험 및 평가 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 print:hidden">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <img src="/komipo-logo.png" alt="한국중부발전" className="h-8 sm:h-10 w-auto object-contain" />
                <h1 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  안전교육 플랫폼
                </h1>
              </div>
              <nav className="space-x-4 text-sm font-medium text-slate-600">
                <a href="/" className="hover:text-blue-600 transition-colors">홈</a>
                <a href="/admin" className="hover:text-blue-600 transition-colors">관리자 모드</a>
              </nav>
            </div>
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
            © 2026 안티그래비티 교육플랫폼. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
