import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { reference } = await req.json();

    if (!reference) {
      return new Response(
        JSON.stringify({ success: false, message: "Reference is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error("Could not verify payment with Paystack");
    }

    const transaction = paystackData.data;
    const isSuccess = transaction.status === "success";

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .update({
        status: isSuccess ? "success" : "failed",
        paystack_transaction_id: String(transaction.id),
        payment_channel: transaction.channel,
        card_type: transaction.authorization?.card_type ?? null,
        bank_name: transaction.authorization?.bank ?? null,
        paid_at: isSuccess ? transaction.paid_at : null,
        metadata: {
          gateway_response: transaction.gateway_response,
          authorization: transaction.authorization,
          customer: transaction.customer,
          fees: transaction.fees,
          ip_address: transaction.ip_address,
        },
      })
      .eq("paystack_reference", reference)
      .select()
      .single();

    if (paymentError) {
      console.error("Payment update error:", paymentError);
      throw new Error("Failed to update payment: " + paymentError.message);
    }

    if (isSuccess && payment?.order_id) {
      const { error: orderError } = await supabase
        .from("orders")
        .update({ status: "confirmed" })
        .eq("id", payment.order_id);

      if (orderError) {
        console.error("Order update error:", orderError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentStatus: isSuccess ? "success" : "failed",
        message: isSuccess
          ? "Payment verified successfully!"
          : "Payment was not successful",
        data: {
          reference: transaction.reference,
          amount: transaction.amount / 100,
          channel: transaction.channel,
          paidAt: transaction.paid_at,
          gatewayResponse: transaction.gateway_response,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("verify-payment error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Verification failed",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});