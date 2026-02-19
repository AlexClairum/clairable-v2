import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/header";
import { PreferencesForm } from "./preferences-form";
import { getCurrentUser } from "@/lib/db";

export default async function PreferencesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  if (!user.role) redirect("/get-started");

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Update your preferences</h1>
          <p className="text-muted-foreground">
            Change your role, time priorities, or AI tools to see different use
            cases.
          </p>
          <PreferencesForm
            defaultValues={{
              role: user.role ?? "",
              time_priorities: user.time_priorities ?? [],
              ai_tools: user.ai_tools ?? [],
            }}
            isIndividual={user.is_individual === true}
          />
        </div>
      </div>
    </div>
  );
}
