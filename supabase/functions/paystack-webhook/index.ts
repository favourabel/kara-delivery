import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

serve(async (req) => {
  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const rawBody = await req.text();
    const paystackSignature = req.headers.get("x-paystack-signature");

    const expectedSignature = createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== paystackSignature) {
      console.error("Invalid Paystack webhook signature");
      return new Response("Unauthorized", { status: 401 });
    }

    const event = JSON.parse(rawBody);

    await supabase.from("webhook_logs").insert({
      event_type: event.event,
      reference: event.data?.reference ?? null,
      payload: event,
      processed: false,
    });

    switch (event.event) {
      case "charge.success": {
        const txn = event.data;
        const reference = txn.reference;

        const { data: payment } = await supabase
          .from("payments")
          .update({
            status: "success",
            paystack_transaction_id: String(txn.id),
            payment_channel: txn.channel,
            card_type: txn.authorization?.card_type ?? null,
            bank_name: txn.authorization?.bank ?? null,
            paid_at: txn.paid_at,
            metadata: {
              gateway_response: txn.gateway_response,
              authorization: txn.authorization,
              customer: txn.customer,
              fees: txn.fees,
            },
          })
          .eq("paystack_reference", reference)
          .select("order_id")
          .single();

        if (payment?.order_id) {
          await supabase
            .from("orders")
            .update({ status: "confirmed" })
            .eq("id", payment.order_id);
        }

        await supabase
          .from("webhook_logs")
          .update({ processed: true })
          .eq("reference", reference)
          .eq("event_type", "charge.success");

        console.log("✅ charge.success processed for:", reference);
        break;
      }

      case "charge.failed": {
        const txn = event.data;
        await supabase
          .from("payments")
          .update({
            status: "failed",
            metadata: { gateway_response: txn.gateway_response },
          })
          .eq("paystack_reference", txn.reference);

        console.log("❌ charge.failed for:", txn.reference);
        break;
      }

      default:
        console.log("Unhandled webhook event:", event.event);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
});