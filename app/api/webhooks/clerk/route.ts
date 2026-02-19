import { WebhookEvent, verifyWebhook } from "@clerk/backend/webhooks";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  let event: WebhookEvent;

  try {
    event = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createServiceRoleClient();

  switch (event.type) {
    case "organization.created": {
      const { id, name } = event.data;
      await supabase.from("organizations").upsert(
        {
          clerk_org_id: id,
          name: name || "Untitled Organization",
          industry: null,
          company_size: null,
          ai_tools: [],
          governance_notes: null,
        },
        { onConflict: "clerk_org_id" }
      );
      break;
    }

    case "user.created": {
      const { id, email_addresses } = event.data;
      const primaryEmail =
        email_addresses?.find((e) => e.id === event.data.primary_email_address_id)
          ?.email_address ||
        email_addresses?.[0]?.email_address ||
        "unknown@example.com";

      await supabase.from("users").upsert(
        {
          clerk_user_id: id,
          email: primaryEmail,
          organization_id: null,
          role: null,
          time_priorities: null,
          is_individual: null,
          ai_tools: null,
        },
        { onConflict: "clerk_user_id" }
      );
      break;
    }

    case "organizationMembership.created": {
      const { organization, public_user_data } = event.data;
      const orgId = organization?.id;
      const clerkUserId = public_user_data?.user_id;

      if (!orgId || !clerkUserId) break;

      const { data: orgRow } = await supabase
        .from("organizations")
        .select("id")
        .eq("clerk_org_id", orgId)
        .single();

      if (!orgRow) {
        await supabase.from("organizations").insert({
          clerk_org_id: orgId,
          name: organization.name || "Untitled Organization",
          industry: null,
          company_size: null,
          ai_tools: [],
          governance_notes: null,
        });
      }

      const { data: org } = await supabase
        .from("organizations")
        .select("id")
        .eq("clerk_org_id", orgId)
        .single();

      if (org) {
        await supabase
          .from("users")
          .update({
            organization_id: org.id,
            is_individual: false,
          })
          .eq("clerk_user_id", clerkUserId);
      }
      break;
    }

    default:
      console.log("Unhandled webhook event:", event.type);
  }

  return new Response("OK", { status: 200 });
}
