import Script from "next/script";
import { ADSENSE_CLIENT_ID } from "@/lib/adsense";

export function AdsenseReviewScript() {
  if (!ADSENSE_CLIENT_ID) {
    return null;
  }

  return (
    <Script
      id="adsense-review-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

