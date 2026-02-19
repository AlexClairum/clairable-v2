import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/header";
import { WelcomeForm } from "./welcome-form";
import { getCurrentUser } from "@/lib/db";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  if (user.role) redirect("/dashboard");

  const params = await searchParams;
  const isIndividual = params.mode === "individual" || user.is_individual === true;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Welcome! Tell us about yourself</h1>
          <p className="text-muted-foreground">
            We'll personalize AI use cases for your role and priorities.
          </p>
          <WelcomeForm isIndividual={isIndividual} />
        </div>
      </div>
    </div>
  );
}
