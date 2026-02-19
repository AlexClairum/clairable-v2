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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const AI_TOOLS = [
  { id: "copilot", label: "Microsoft Copilot" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "claude", label: "Claude" },
  { id: "gemini", label: "Google Gemini" },
];

const schema = z.object({
  name: z.string().min(1, "Organization name is required"),
  industry: z.string().min(1, "Industry is required"),
  company_size: z.string().min(1, "Company size is required"),
  ai_tools: z.array(z.string()).min(1, "Select at least one AI tool"),
  governance_notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface OrgSetupFormProps {
  defaultName?: string;
  clerkOrgId: string;
}

export function OrgSetupForm({ defaultName = "", clerkOrgId }: OrgSetupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultName,
      industry: "",
      company_size: "",
      ai_tools: [],
      governance_notes: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const res = await fetch("/api/organizations/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerk_org_id: clerkOrgId,
        ...values,
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/admin");
    else {
      const data = await res.json();
      form.setError("root", { message: data.error || "Failed to save" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company size</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                  <SelectItem value="201-500">201-500</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ai_tools"
          render={() => (
            <FormItem>
              <FormLabel>What AI tools do you have?</FormLabel>
              <FormDescription>Select all that apply</FormDescription>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="governance_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Governance restrictions (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='e.g., "No customer data in AI tools", "Healthcare compliance required"'
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save & continue"}
        </Button>
      </form>
    </Form>
  );
}
