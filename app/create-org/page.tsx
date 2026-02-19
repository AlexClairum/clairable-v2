"use client";

import { useRouter } from "next/navigation";
import { CreateOrganization } from "@clerk/nextjs";

export default function CreateOrgPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <CreateOrganization
        afterCreateOrganizationUrl="/onboarding"
        skipInvitationScreen={false}
      />
    </div>
  );
}
