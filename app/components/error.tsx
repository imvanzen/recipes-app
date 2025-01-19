import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface ErrorDisplayProps {
  error: Error;
  reset?: () => void;
}

export default function ErrorDisplay({ error, reset }: ErrorDisplayProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Error</h2>
        </div>
        <p className="text-center text-muted-foreground">{error.message}</p>
        <div className="flex gap-2">
          {reset && (
            <Button onClick={reset} variant="outline">
              Try again
            </Button>
          )}
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
