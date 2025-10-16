import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "日本の調味料顔診断 | Japanese Seasoning Face Test",
  description:
    "あなたの顔はどの日本の調味料に似ている？写真をアップロードして診断しよう！",
  keywords: ["調味料", "顔診断", "AI", "日本", "性格診断", "face test"],
  openGraph: {
    title: "日本の調味料顔診断",
    description: "あなたの顔はどの日本の調味料に似ている？",
    type: "website",
    locale: "ja_JP",
    alternateLocale: ["ko_KR", "en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "日本の調味料顔診断",
    description: "あなたの顔はどの日本の調味料に似ている？",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
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
