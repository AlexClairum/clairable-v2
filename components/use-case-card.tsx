"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FeedbackModal } from "@/components/feedback-modal";

export interface UseCaseCardProps {
  id: string;
  title: string;
  description: string;
  promptTemplate: string;
  timeSavedMinutes: number | null;
  whyItWorks?: string;
  onAttempt: (useCaseId: string, status: "worked" | "didnt_work", feedback?: Record<string, unknown>) => Promise<void>;
}

export function UseCaseCard({
  id,
  title,
  description,
  promptTemplate,
  timeSavedMinutes,
  whyItWorks,
  onAttempt,
}: UseCaseCardProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"worked" | "didnt_work" | null>(null);

  async function handleCopy() {
    await navigator.clipboard.writeText(promptTemplate);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleAttempt(status: "worked" | "didnt_work", feedback?: Record<string, unknown>) {
    setLoading(status);
    try {
      await onAttempt(id, status, feedback);
      toast.success("Thanks for the feedback!");
      setModalOpen(false);
      setPendingStatus(null);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  function openFeedbackModal(status: "worked" | "didnt_work") {
    setPendingStatus(status);
    setModalOpen(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {whyItWorks && (
          <p className="text-sm text-muted-foreground italic">{whyItWorks}</p>
        )}
        {timeSavedMinutes && (
          <p className="text-sm text-muted-foreground">
            Est. time saved: ~{timeSavedMinutes} min
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Copy-paste prompt:</p>
          <div className="relative rounded-md border bg-muted/50 p-3 text-sm">
            <pre className="whitespace-pre-wrap break-words font-mono text-xs">
              {promptTemplate}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => openFeedbackModal("worked")}
            disabled={loading !== null}
          >
            {loading === "worked" ? <Loader2 className="h-4 w-4 animate-spin" /> : "It worked!"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => openFeedbackModal("didnt_work")}
            disabled={loading !== null}
          >
            {loading === "didnt_work" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Didn't work"
            )}
          </Button>
        </div>
        <FeedbackModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          status={pendingStatus ?? "worked"}
          onSubmit={(feedback) => pendingStatus && handleAttempt(pendingStatus, feedback)}
          loading={loading !== null}
        />
      </CardContent>
    </Card>
  );
}
