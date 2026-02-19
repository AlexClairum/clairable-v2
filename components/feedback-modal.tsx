"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export interface WorkedFeedback {
  timeSaved?: string;
  wouldRecommend?: boolean;
  improvements?: string;
}

export interface DidntWorkFeedback {
  whatWentWrong?: string;
  desiredOutcome?: string;
  howToImprove?: string;
}

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: "worked" | "didnt_work";
  onSubmit: (feedback: Record<string, unknown>) => void;
  loading: boolean;
}

const TIME_SAVED_OPTIONS = [
  { value: "less_5", label: "Less than 5 min" },
  { value: "5_15", label: "5-15 min" },
  { value: "15_30", label: "15-30 min" },
  { value: "30_plus", label: "30+ min" },
];

export function FeedbackModal({
  open,
  onOpenChange,
  status,
  onSubmit,
  loading,
}: FeedbackModalProps) {
  const [timeSaved, setTimeSaved] = useState<string>("");
  const [wouldRecommend, setWouldRecommend] = useState<string>("");
  const [improvements, setImprovements] = useState("");
  const [whatWentWrong, setWhatWentWrong] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [howToImprove, setHowToImprove] = useState("");

  function resetForm() {
    setTimeSaved("");
    setWouldRecommend("");
    setImprovements("");
    setWhatWentWrong("");
    setDesiredOutcome("");
    setHowToImprove("");
  }

  function handleSubmit() {
    if (status === "worked") {
      onSubmit({
        timeSaved: timeSaved || undefined,
        wouldRecommend: wouldRecommend === "yes" ? true : wouldRecommend === "no" ? false : undefined,
        improvements: improvements.trim() || undefined,
      });
    } else {
      onSubmit({
        whatWentWrong: whatWentWrong.trim() || undefined,
        desiredOutcome: desiredOutcome.trim() || undefined,
        howToImprove: howToImprove.trim() || undefined,
      });
    }
    resetForm();
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>
            {status === "worked" ? "Great to hear it worked!" : "Thanks for letting us know"}
          </DialogTitle>
          <DialogDescription>
            {status === "worked"
              ? "Optional: Share a bit more so we can improve for others."
              : "Optional: Help us improve by sharing what happened."}
          </DialogDescription>
        </DialogHeader>
        {status === "worked" ? (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="time-saved">How much time did you save?</Label>
              <Select value={timeSaved} onValueChange={setTimeSaved}>
                <SelectTrigger id="time-saved">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SAVED_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="would-recommend">Would you recommend this to others?</Label>
              <Select value={wouldRecommend} onValueChange={setWouldRecommend}>
                <SelectTrigger id="would-recommend">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="improvements">Any improvements you'd recommend?</Label>
              <Textarea
                id="improvements"
                placeholder="e.g. Add a section for..."
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="what-went-wrong">What went wrong?</Label>
              <Textarea
                id="what-went-wrong"
                placeholder="Describe what happened..."
                value={whatWentWrong}
                onChange={(e) => setWhatWentWrong(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desired-outcome">What outcome were you looking for?</Label>
              <Textarea
                id="desired-outcome"
                placeholder="What did you expect?"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="how-to-improve">How could we improve this prompt?</Label>
              <Textarea
                id="how-to-improve"
                placeholder="Any suggestions..."
                value={howToImprove}
                onChange={(e) => setHowToImprove(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onSubmit({});
            }}
            disabled={loading}
          >
            Skip
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
