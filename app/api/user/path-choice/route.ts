import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const path = body?.path;

  if (path !== "individual") {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("users")
    .update({ is_individual: true })
    .eq("clerk_user_id", userId);

  if (error) {
    console.error("Path choice update failed:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
