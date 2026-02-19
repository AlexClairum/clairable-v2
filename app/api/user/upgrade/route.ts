import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, industry, company_size, ai_tools, governance_notes } = body;

  if (!name || !industry || !company_size || !Array.isArray(ai_tools) || ai_tools.length === 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const clerk = await clerkClient();
  const org = await clerk.organizations.createOrganization({
    name,
    createdBy: userId,
  });

  if (!org?.id) {
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }

  const supabase = createServiceRoleClient();
  const { data: orgRow, error: orgError } = await supabase
    .from("organizations")
    .insert({
      clerk_org_id: org.id,
      name,
      industry,
      company_size,
      ai_tools,
      governance_notes: governance_notes || null,
    })
    .select("id")
    .single();

  if (orgError || !orgRow) {
    console.error("Supabase org insert failed:", orgError);
    return NextResponse.json({ error: "Failed to save organization" }, { status: 500 });
  }

  const { error: userError } = await supabase
    .from("users")
    .update({
      organization_id: orgRow.id,
      is_individual: false,
    })
    .eq("clerk_user_id", userId);

  if (userError) {
    console.error("User update failed:", userError);
    return NextResponse.json({ error: "Failed to link user" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
