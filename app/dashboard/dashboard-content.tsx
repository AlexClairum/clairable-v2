"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UseCaseCard } from "@/components/use-case-card";

interface UseCase {
  id: string;
  title: string;
  description: string;
  prompt_template: string;
  time_saved_minutes: number | null;
  why_it_works: string | null;
}

const AI_TOOL_LABELS: Record<string, string> = {
  copilot: "Microsoft Copilot",
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Google Gemini",
};

interface TriedUseCase {
  id: string;
  title: string;
  status: string;
}

interface DashboardContentProps {
  useCases: UseCase[];
  triedUseCases: TriedUseCase[];
  isIndividual: boolean;
  totalTimeSaved: number;
  triedCount: number;
  workedCount: number;
  showConversionBanner: boolean;
  aiTools: string[];
  userRole: string | null;
}

export function DashboardContent({
  useCases,
  triedUseCases,
  isIndividual,
  totalTimeSaved,
  triedCount,
  workedCount,
  showConversionBanner,
  aiTools,
  userRole,
}: DashboardContentProps) {
  const toolLabels = aiTools.map((t) => AI_TOOL_LABELS[t] ?? t);
  const toolsText = toolLabels.length > 0 ? toolLabels.join(", ") : "AI tools";
  const router = useRouter();

  async function handleAttempt(
    useCaseId: string,
    status: "worked" | "didnt_work",
    feedback?: Record<string, unknown>
  ) {
    const res = await fetch("/api/use-cases/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ use_case_id: useCaseId, status, feedback }),
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
          You indicated you have access to <strong>{toolsText}</strong>. We've
          found prompts below that fit your workflow. Try one, then tell us how
          it went.{" "}
          <Link
            href="/preferences"
            className="underline hover:text-foreground text-muted-foreground"
          >
            Update preferences
          </Link>{" "}
          to switch roles or AI tools.
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

      {triedUseCases.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer list-none text-sm font-medium text-muted-foreground hover:text-foreground">
            Use cases you&apos;ve tried ({triedUseCases.length})
          </summary>
          <ul className="mt-3 space-y-2 rounded-lg border p-4">
            {triedUseCases.map((uc) => (
              <li
                key={uc.id}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span>{uc.title}</span>
                <Badge
                  variant={
                    uc.status === "worked" ? "default" : "destructive"
                  }
                >
                  {uc.status === "worked" ? "Worked" : "Didn't work"}
                </Badge>
              </li>
            ))}
          </ul>
        </details>
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
          No use cases match yet.{" "}
          <Link href="/preferences" className="underline hover:text-foreground">
            Update your preferences
          </Link>{" "}
          to see more options.
        </p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Let us know what worked once you've tried one!
          </p>
          <div className="grid gap-6">
          {useCases.map((uc) => (
            <UseCaseCard
              key={uc.id}
              id={uc.id}
              title={uc.title}
              description={uc.description}
              promptTemplate={uc.prompt_template}
              timeSavedMinutes={uc.time_saved_minutes}
              whyItWorks={uc.why_it_works ?? undefined}
              onAttempt={handleAttempt}
            />
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
