export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5555878466921311";

export const ADSENSE_AD_UNITS_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_ADSENSE_AD_UNITS === "true";

export const ADSENSE_SLOTS = {
  home: process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT || "",
};

