import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/header";
import { DashboardContent } from "./dashboard-content";
import { getCurrentUser, getOrganizationById } from "@/lib/db";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { matchUseCases } from "@/lib/use-case-matcher";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  if (!user.role) redirect("/get-started");

  let org = null;
  if (user.organization_id) {
    org = await getOrganizationById(user.organization_id);
  }

  const aiTools = org?.ai_tools ?? user.ai_tools ?? [];
  const hasNoTools = aiTools.length === 0;
  if (hasNoTools && user.is_individual === true) redirect("/welcome");

  const effectiveTools = hasNoTools ? ["copilot", "chatgpt", "claude", "gemini"] : aiTools;

  const supabase = createServiceRoleClient();
  const { data: useCases } = await supabase.from("use_cases").select("*");
  const { data: attempts } = await supabase
    .from("user_attempts")
    .select("use_case_id")
    .eq("user_id", user.id);

  const attemptedIds = (attempts || []).map((a) => a.use_case_id);
  const matched = matchUseCases(
    useCases || [],
    attemptedIds,
    user.role,
    user.time_priorities,
    effectiveTools
  );

  const { data: allAttempts } = await supabase
    .from("user_attempts")
    .select("status, use_case_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: attemptedUseCases } =
    attemptedIds.length > 0
      ? await supabase
          .from("use_cases")
          .select("id, title")
          .in("id", attemptedIds)
      : { data: [] };

  const useCaseMap = new Map((attemptedUseCases || []).map((uc) => [uc.id, uc.title]));
  const latestStatusByUseCase = new Map<string, string>();
  for (const a of allAttempts || []) {
    if (!latestStatusByUseCase.has(a.use_case_id)) {
      latestStatusByUseCase.set(a.use_case_id, a.status);
    }
  }
  const triedUseCases =
    attemptedIds.length > 0
      ? Array.from(new Set(attemptedIds)).map((id) => ({
          id,
          title: useCaseMap.get(id) ?? "Unknown",
          status: latestStatusByUseCase.get(id) ?? "worked",
        }))
      : [];

  const workedAttempts =
    allAttempts?.filter((a) => a.status === "worked") || [];
  const workedUseCaseIds = new Set(workedAttempts.map((a) => a.use_case_id));
  const { data: workedUseCases } = await supabase
    .from("use_cases")
    .select("time_saved_minutes")
    .in("id", Array.from(workedUseCaseIds));

  const totalTimeSaved = workedUseCases?.reduce(
    (sum, uc) => sum + (uc.time_saved_minutes || 0),
    0
  ) ?? 0;

  const triedCount = allAttempts?.length ?? 0;
  const workedCount = workedAttempts.length;
  const showConversionBanner =
    user.is_individual === true && triedCount >= 3 && workedCount >= 1;

  return (
    <div className="min-h-screen">
      <Header />
      <DashboardContent
        useCases={matched}
        triedUseCases={triedUseCases}
        isIndividual={user.is_individual === true}
        totalTimeSaved={totalTimeSaved}
        triedCount={triedCount}
        workedCount={workedCount}
        showConversionBanner={showConversionBanner}
        aiTools={effectiveTools}
        userRole={user.role}
      />
    </div>
  );
}
