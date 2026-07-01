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

    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      orderNotes,
      items,
      subtotal,
      totalAmount,
      paymentChannel,
      paystackReference, // ← NEW: reference from the ALREADY completed transaction
    } = await req.json();

    // ── Validate required fields ──────────────────────────────────────────
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !deliveryAddress ||
      !items ||
      !totalAmount ||
      !paystackReference
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ── STEP 1: Verify the transaction directly with Paystack ──────────────
    // This is the critical security check. We NEVER trust the frontend's
    // claim that payment succeeded — we confirm it with Paystack's servers
    // using our SECRET key (never exposed to the browser).
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${paystackReference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      console.error("Payment verification failed:", verifyData);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment could not be verified. Order not created.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ── STEP 2: Confirm the amount paid matches the expected total ─────────
    // Paystack returns amount in KOBO — convert to Naira before comparing.
    const amountPaidInNaira = verifyData.data.amount / 100;
    if (amountPaidInNaira !== Number(totalAmount)) {
      console.error(
        `Amount mismatch: expected ₦${totalAmount}, got ₦${amountPaidInNaira}`
      );
      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment amount mismatch. Order not created.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ── STEP 3: Generate a unique order number ──────────────────────────────
    const orderNumber =
      "AKR-" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      "-" +
      Math.floor(Math.random() * 10000).toString().padStart(4, "0");

    // ── STEP 4: Insert the order — marked "paid" since it's now verified ───
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        order_notes: orderNotes || null,
        items: items,
        subtotal: subtotal,
        total_amount: totalAmount,
        status: "paid", // ✅ Safe to mark paid — Paystack confirmed it
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      throw new Error("Failed to create order: " + orderError.message);
    }

    // ── STEP 5: Insert the verified payment record ──────────────────────────
    const { error: paymentError } = await supabase.from("payments").insert({
      order_id: order.id,
      paystack_reference: paystackReference,
      paystack_access_code: null,
      amount: totalAmount,
      currency: "NGN",
      payment_channel: paymentChannel || verifyData.data.channel,
      status: "success", // ✅ Verified successful
      metadata: {
        order_number: orderNumber,
        items: items,
        paystack_transaction_id: verifyData.data.id,
        paystack_verified_at: new Date().toISOString(),
      },
    });

    if (paymentError) {
      console.error("Payment insert error:", paymentError);
      throw new Error("Failed to save payment record: " + paymentError.message);
    }

    // ── Success response ─────────────────────────────────────────────────────
    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        orderNumber: orderNumber,
        paystackReference: paystackReference,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("create-order error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Something went wrong",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});