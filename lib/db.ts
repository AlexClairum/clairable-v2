import { auth } from "@clerk/nextjs/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type User = {
  id: string;
  clerk_user_id: string;
  email: string;
  organization_id: string | null;
  role: string | null;
  time_priorities: string[] | null;
  is_individual: boolean | null;
  ai_tools: string[] | null;
};

export type Organization = {
  id: string;
  clerk_org_id: string;
  name: string;
  industry: string | null;
  company_size: string | null;
  ai_tools: string[] | null;
  governance_notes: string | null;
};

export type UseCase = {
  id: string;
  title: string;
  description: string;
  role: string;
  tool: string;
  time_activity: string;
  prompt_template: string;
  time_saved_minutes: number | null;
};

export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function ensureUserExists(clerkUserId: string, email: string): Promise<User | null> {
  const supabase = createServiceRoleClient();
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (existing) return existing as User;

  const { data: inserted, error } = await supabase
    .from("users")
    .insert({
      clerk_user_id: clerkUserId,
      email,
      organization_id: null,
      role: null,
      time_priorities: null,
      is_individual: null,
      ai_tools: null,
    })
    .select()
    .single();

  if (error) return null;
  return inserted as User;
}

export async function getOrganizationByClerkOrgId(
  clerkOrgId: string
): Promise<Organization | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("clerk_org_id", clerkOrgId)
    .single();
  return data as Organization | null;
}

export async function getOrganizationById(
  id: string
): Promise<Organization | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();
  return data as Organization | null;
}
