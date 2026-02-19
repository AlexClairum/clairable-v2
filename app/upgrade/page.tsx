import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/header";
import { UpgradeForm } from "./upgrade-form";
import { getCurrentUser } from "@/lib/db";

export default async function UpgradePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  if (user.is_individual !== true) redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Invite your team</h1>
          <p className="text-muted-foreground">
            Create your organization and invite your team to track AI adoption together.
          </p>
          <UpgradeForm />
        </div>
      </div>
    </div>
  );
}
