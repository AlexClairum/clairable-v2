import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { role, time_priorities, ai_tools } = body;

  if (!role || !Array.isArray(time_priorities)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const roleNormalized =
    typeof role === "string" && role.length > 0
      ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
      : role;

  const updates: Record<string, unknown> = {
    role: roleNormalized,
    time_priorities,
  };
  if (ai_tools && Array.isArray(ai_tools)) {
    updates.ai_tools = ai_tools;
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("clerk_user_id", userId);

  if (error) {
    console.error("Welcome update failed:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
