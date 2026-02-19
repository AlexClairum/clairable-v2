import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/header";
import { AdminDashboard } from "./admin-dashboard";
import { getOrganizationByClerkOrgId } from "@/lib/db";
import { createServiceRoleClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const { orgId, orgRole } = await auth();
  if (!orgId) redirect("/get-started");
  if (orgRole !== "org:admin") redirect("/dashboard");

  const org = await getOrganizationByClerkOrgId(orgId);
  if (!org) redirect("/onboarding");

  const supabase = createServiceRoleClient();
  const { data: users } = await supabase
    .from("users")
    .select("id")
    .eq("organization_id", org.id);

  const userIds = (users || []).map((u) => u.id);
  const { data: attempts } = await supabase
    .from("user_attempts")
    .select("user_id, use_case_id, status")
    .in("user_id", userIds);

  const triedUserIds = new Set(
    (attempts || []).map((a) => a.user_id)
  );
  const triedCount = triedUserIds.size;
  const totalMembers = userIds.length;
  const adoptionPct =
    totalMembers > 0 ? Math.round((triedCount / totalMembers) * 100) : 0;

  const workedAttempts = (attempts || []).filter((a) => a.status === "worked");
  const successRate =
    attempts && attempts.length > 0
      ? Math.round((workedAttempts.length / attempts.length) * 100)
      : 0;

  const workedUseCaseIds = new Set(workedAttempts.map((a) => a.use_case_id));
  const { data: workedUseCases } = await supabase
    .from("use_cases")
    .select("time_saved_minutes")
    .in("id", Array.from(workedUseCaseIds));

  const totalTimeSaved =
    workedUseCases?.reduce(
      (sum, uc) => sum + (uc.time_saved_minutes || 0),
      0
    ) ?? 0;

  const useCaseCounts: Record<string, number> = {};
  (attempts || []).forEach((a) => {
    useCaseCounts[a.use_case_id] = (useCaseCounts[a.use_case_id] || 0) + 1;
  });
  const sortedUseCaseIds = Object.entries(useCaseCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([id]) => id);

  const { data: popularUseCases } = await supabase
    .from("use_cases")
    .select("id, title")
    .in("id", sortedUseCaseIds);

  const popularWithCounts = sortedUseCaseIds
    .map((id) => {
      const uc = popularUseCases?.find((u) => u.id === id);
      return uc
        ? { title: uc.title, count: useCaseCounts[id] }
        : null;
    })
    .filter(Boolean) as { title: string; count: number }[];

  return (
    <div className="min-h-screen">
      <Header />
      <AdminDashboard
        totalMembers={totalMembers}
        adoptionPct={adoptionPct}
        totalTried={attempts?.length ?? 0}
        successRate={successRate}
        totalTimeSaved={totalTimeSaved}
        popularUseCases={popularWithCounts}
      />
    </div>
  );
}
