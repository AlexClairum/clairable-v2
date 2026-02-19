import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Clairable</h1>
        <p className="text-muted-foreground max-w-md">
          Discover role-specific AI use cases and get ROI from the AI tools you
          already own.
        </p>
      </div>
      <SignedOut>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <Button asChild>
          <Link href="/get-started">Continue</Link>
        </Button>
      </SignedIn>
    </div>
  );
}
