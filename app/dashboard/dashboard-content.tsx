"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UseCaseCard } from "@/components/use-case-card";

interface UseCase {
  id: string;
  title: string;
  description: string;
  prompt_template: string;
  time_saved_minutes: number | null;
}

interface DashboardContentProps {
  useCases: UseCase[];
  isIndividual: boolean;
  totalTimeSaved: number;
  triedCount: number;
  workedCount: number;
  showConversionBanner: boolean;
}

export function DashboardContent({
  useCases,
  isIndividual,
  totalTimeSaved,
  triedCount,
  workedCount,
  showConversionBanner,
}: DashboardContentProps) {
  const router = useRouter();

  async function handleAttempt(
    useCaseId: string,
    status: "tried" | "worked" | "didnt_work"
  ) {
    const res = await fetch("/api/use-cases/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ use_case_id: useCaseId, status }),
    });
    if (!res.ok) throw new Error("Failed");
    router.refresh();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          Here are 3 ways to use AI for your work today
        </h1>
        <p className="text-muted-foreground mt-1">
          Try a prompt, then mark how it went. We'll show you more.
        </p>
      </div>

      {showConversionBanner && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <p className="font-medium">
              You've saved ~{totalTimeSaved} minutes. Imagine if your whole team
              was doing this.
            </p>
            <Button asChild className="mt-4">
              <Link href="/upgrade">Invite your team</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {isIndividual && (
        <div className="flex items-center justify-between">
          <Card className="flex-1 max-w-xs">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Your progress</p>
              <p className="text-lg font-semibold">
                {triedCount} tried, {workedCount} worked, ~{totalTimeSaved} min saved
              </p>
            </CardContent>
          </Card>
          <Button variant="outline" asChild>
            <Link href="/upgrade">Invite your team</Link>
          </Button>
        </div>
      )}

      {useCases.length === 0 ? (
        <p className="text-muted-foreground">
          No use cases match yet. Try updating your preferences in your profile.
        </p>
      ) : (
        <div className="grid gap-6">
          {useCases.map((uc) => (
            <UseCaseCard
              key={uc.id}
              id={uc.id}
              title={uc.title}
              description={uc.description}
              promptTemplate={uc.prompt_template}
              timeSavedMinutes={uc.time_saved_minutes}
              onAttempt={handleAttempt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
