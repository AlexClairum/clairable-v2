import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/header";
import { OrgSetupForm } from "@/components/org-setup-form";
import { getOrganizationByClerkOrgId } from "@/lib/db";

export default async function OnboardingPage() {
  const { orgId, orgRole } = await auth();
  if (!orgId) redirect("/get-started");

  if (orgRole !== "org:admin") {
    redirect("/dashboard");
  }

  const org = await getOrganizationByClerkOrgId(orgId);
  if (org?.industry) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Set up your organization</h1>
          <p className="text-muted-foreground">
            Tell us about your company so we can tailor AI use cases for your team.
          </p>
          <OrgSetupForm defaultName={org?.name} clerkOrgId={orgId} />
        </div>
      </div>
    </div>
  );
}
