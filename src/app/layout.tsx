import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "日本の調味料顔診断 - AI顔分析で自分のタイプを発見 | Japanese Seasoning Face Test",
  description:
    "あなたの顔はどの日本の調味料に似ている？醤油、味噌、塩、砂糖など9種類の調味料タイプをAI技術で診断。写真をアップロードするだけで簡単・無料。プライバシー保護で安心。SNSでシェアして友達と楽しもう！",
  keywords: [
    "調味料",
    "顔診断",
    "AI",
    "日本",
    "性格診断",
    "face test",
    "醤油",
    "味噌",
    "顔タイプ",
    "顔分析",
    "無料診断",
    "エンターテインメント",
    "SNS",
    "シェア",
  ],
  openGraph: {
    title: "日本の調味料顔診断 - AI顔分析サービス",
    description:
      "AI技術であなたの顔がどの日本の調味料に似ているか診断。9種類の調味料タイプから自分のタイプを発見しよう！",
    type: "website",
    locale: "ja_JP",
    alternateLocale: ["ko_KR", "en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "日本の調味料顔診断",
    description:
      "あなたは醤油タイプ？それとも味噌タイプ？AIで顔診断してみよう！",
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Japanese Seasoning Face Test" }],
  category: "Entertainment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* Google AdSense - サイト検証用 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5555878466921311"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Teachable Machine ライブラリ */}
        <Script
          src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"
          strategy="beforeInteractive"
        />

        {GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
