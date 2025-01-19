"use client";

import ErrorDisplay from "@/app/components/error";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorDisplay error={error} reset={reset} />;
}
