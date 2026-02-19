import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InviteAcceptPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; org?: string }>;
}) {
  const { userId } = await auth();
  const params = await searchParams;

  if (!userId) {
    redirect("/sign-up?redirect_url=" + encodeURIComponent("/invite/accept?" + new URLSearchParams(params as Record<string, string>).toString()));
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>You&apos;ve been invited</CardTitle>
          <CardDescription>
            {params.org
              ? `You've been invited to join ${params.org} on Clairable.`
              : "You've been invited to join an organization on Clairable."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/get-started">Accept invite</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/get-started?try_first=1">Try it yourself first</Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Explore on your own, then join the team later. Your progress will be
            preserved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
