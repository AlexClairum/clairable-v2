import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { use_case_id, status, feedback } = body;

  if (!use_case_id || !["worked", "didnt_work"].includes(status)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const feedbackText =
    feedback && typeof feedback === "object"
      ? JSON.stringify(feedback)
      : typeof feedback === "string"
        ? feedback
        : null;

  const supabase = createServiceRoleClient();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { error } = await supabase.from("user_attempts").insert({
    user_id: user.id,
    use_case_id,
    status,
    feedback: feedbackText,
  });

  if (error) {
    console.error("Attempt failed:", error);
    return NextResponse.json({ error: "Failed to record" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
