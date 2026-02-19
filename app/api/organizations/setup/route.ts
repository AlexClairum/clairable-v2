import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { clerk_org_id, name, industry, company_size, ai_tools, governance_notes } = body;

  if (clerk_org_id !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("organizations")
    .upsert(
      {
        clerk_org_id,
        name: name || "Untitled Organization",
        industry: industry || null,
        company_size: company_size || null,
        ai_tools: ai_tools || [],
        governance_notes: governance_notes || null,
      },
      { onConflict: "clerk_org_id" }
    );

  if (error) {
    console.error("Org setup failed:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
