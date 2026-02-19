import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/header";
import { OrganizationProfile } from "@clerk/nextjs";

export default async function InvitePage() {
  const { orgId, orgRole } = await auth();
  if (!orgId || orgRole !== "org:admin") redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex justify-center py-12">
        <OrganizationProfile
          appearance={{
            elements: {
              rootBox: "w-full max-w-4xl",
            },
          }}
        />
      </div>
    </div>
  );
}
