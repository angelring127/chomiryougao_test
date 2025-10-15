declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export function pageview(url: string, title?: string) {
  if (!window.gtag) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
}

export function event(action: string, params?: Record<string, any>) {
  if (!window.gtag) return;

  window.gtag("event", action, params);
}

export const trackEvents = {
  uploadStart: () => {
    event("upload_start", {
      event_category: "engagement",
      event_label: "image_upload",
    });
  },

  uploadSuccess: () => {
    event("upload_success", {
      event_category: "engagement",
      event_label: "image_upload",
    });
  },

  uploadError: (errorType: string) => {
    event("upload_error", {
      event_category: "error",
      event_label: errorType,
    });
  },

  inferenceStart: (modelVersion: string) => {
    event("inference_start", {
      event_category: "engagement",
      model_version: modelVersion,
    });
  },

  inferenceDone: (modelVersion: string, durationMs: number) => {
    event("inference_done", {
      event_category: "engagement",
      model_version: modelVersion,
      duration_ms: durationMs,
    });
  },

  shareClick: (channel: string, topLabel: string) => {
    event("share_click", {
      event_category: "engagement",
      channel,
      top_label: topLabel,
    });
  },

  langChange: (from: string, to: string) => {
    event("lang_change", {
      event_category: "engagement",
      from,
      to,
    });
  },
};
