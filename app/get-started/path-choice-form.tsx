"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function PathChoiceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<"individual" | "team" | null>(null);

  async function chooseIndividual() {
    setLoading("individual");
    const res = await fetch("/api/user/path-choice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "individual" }),
    });
    if (res.ok) router.push("/welcome?mode=individual");
    else setLoading(null);
  }

  async function chooseTeam() {
    setLoading("team");
    router.push("/create-org");
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card
        className="cursor-pointer transition-colors hover:border-primary"
        onClick={chooseIndividual}
      >
        <CardHeader>
          <CardTitle>Try it myself</CardTitle>
          <CardDescription>
            Explore AI use cases for your role. No setup. ~3 min to value.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            disabled={loading !== null}
            onClick={(e) => {
              e.stopPropagation();
              chooseIndividual();
            }}
          >
            {loading === "individual" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Get started"
            )}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            You can invite your team later.
          </p>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer transition-colors hover:border-primary"
        onClick={chooseTeam}
      >
        <CardHeader>
          <CardTitle>Set up for my team</CardTitle>
          <CardDescription>
            Create org, invite team, track adoption. Best for admins.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            disabled={loading !== null}
            onClick={(e) => {
              e.stopPropagation();
              chooseTeam();
            }}
          >
            {loading === "team" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create organization"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
