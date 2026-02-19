import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getCurrentUser, ensureUserExists } from "@/lib/db";
import { PathChoiceForm } from "./path-choice-form";

export default async function GetStartedPage({
  searchParams,
}: {
  searchParams: Promise<{ try_first?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let user = await getCurrentUser();
  if (!user) {
    const clerkUser = await currentUser();
    const email =
      clerkUser?.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
      clerkUser?.emailAddresses?.[0]?.emailAddress ??
      "unknown@example.com";
    user = await ensureUserExists(userId, email);
  }
  if (!user) redirect("/sign-in");

  const params = await searchParams;
  if (params.try_first === "1" && user.is_individual !== true) {
    const { createServiceRoleClient } = await import("@/lib/supabase/server");
    const supabase = createServiceRoleClient();
    await supabase
      .from("users")
      .update({ is_individual: true })
      .eq("clerk_user_id", userId);
    redirect("/welcome?mode=individual");
  }

  if (user.role) {
    redirect("/dashboard");
  }

  if (user.organization_id && !user.is_individual) {
    redirect("/onboarding");
  }

  if (user.is_individual === true) {
    redirect("/welcome?mode=individual");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">How would you like to get started?</h1>
          <p className="text-muted-foreground">
            Choose the path that fits you best. You can change later.
          </p>
        </div>
        <PathChoiceForm />
      </div>
    </div>
  );
}
