"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const ROLES = [
  "Sales",
  "Marketing",
  "Finance",
  "Operations",
  "HR",
  "IT",
  "Customer Support",
  "Other",
];

const TIME_PRIORITIES = [
  { id: "writing", label: "Writing emails" },
  { id: "data_analysis", label: "Data analysis" },
  { id: "meetings", label: "Meetings" },
  { id: "research", label: "Research" },
  { id: "reports", label: "Reports" },
  { id: "other", label: "Other" },
];

const AI_TOOLS = [
  { id: "copilot", label: "Microsoft Copilot" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "claude", label: "Claude" },
  { id: "gemini", label: "Google Gemini" },
];

const baseSchema = z.object({
  role: z.string().min(1, "Role is required"),
  time_priorities: z.array(z.string()).min(1, "Select at least one"),
  ai_tools: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof baseSchema>;

interface WelcomeFormProps {
  isIndividual: boolean;
}

function getSchema(isIndividual: boolean) {
  return isIndividual
    ? baseSchema.extend({
        ai_tools: z.array(z.string()).min(1, "Select at least one AI tool"),
      })
    : baseSchema;
}

export function WelcomeForm({ isIndividual }: WelcomeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(getSchema(isIndividual)),
    defaultValues: {
      role: "",
      time_priorities: [],
      ai_tools: isIndividual ? [] : undefined,
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const res = await fetch("/api/user/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: values.role,
        time_priorities: values.time_priorities,
        ai_tools: isIndividual ? values.ai_tools : undefined,
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/dashboard");
    else form.setError("root", { message: "Failed to save" });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What's your role?</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time_priorities"
          render={() => (
            <FormItem>
              <FormLabel>What takes up most of your time?</FormLabel>
              <div className="grid gap-2 py-2">
                {TIME_PRIORITIES.map((p) => (
                  <FormField
                    key={p.id}
                    control={form.control}
                    name="time_priorities"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(p.id)}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                checked
                                  ? [...(field.value || []), p.id]
                                  : field.value?.filter((v) => v !== p.id) || []
                              );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{p.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {isIndividual && (
          <FormField
            control={form.control}
            name="ai_tools"
            render={() => (
              <FormItem>
                <FormLabel>Which AI tools do you have access to?</FormLabel>
                <div className="grid gap-2 py-2">
                  {AI_TOOLS.map((tool) => (
                    <FormField
                      key={tool.id}
                      control={form.control}
                      name="ai_tools"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(tool.id)}
                              onCheckedChange={(checked) => {
                                field.onChange(
                                  checked
                                    ? [...(field.value || []), tool.id]
                                    : field.value?.filter((v) => v !== tool.id) || []
                                );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{tool.label}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
