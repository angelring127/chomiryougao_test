import { Suspense } from "react";
import { ResultContent } from "./result-content";

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
