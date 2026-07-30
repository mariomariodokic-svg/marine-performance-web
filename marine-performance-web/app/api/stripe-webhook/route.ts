import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { products, ProductKey } from "@/lib/products";

export const runtime = "nodejs";

async function fulfill(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const productKey = session.metadata?.productKey as ProductKey | undefined;
  const email = session.customer_details?.email;
  if (!productKey || !(productKey in products) || !email) return;

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("orders")
    .select("stripe_session_id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (existing) return;

  let deliveryHtml = "";
  if (productKey === "ebook") {
    const bucket = process.env.SUPABASE_EBOOK_BUCKET;
    const path = process.env.SUPABASE_EBOOK_PATH;
    if (!bucket || !path) throw new Error("Nedostaje putanja e-knjige.");

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * 24 * 3, { download: true });
    if (error || !data?.signedUrl) throw error ?? new Error("Nije kreirana poveznica.");

    deliveryHtml = `<p><a href="${data.signedUrl}">Preuzmi e-knjigu</a></p><p>Poveznica vrijedi 72 sata.</p>`;
  } else {
    const bookingUrl = process.env.BOOKING_URL;
    deliveryHtml = bookingUrl
      ? `<p><a href="${bookingUrl}">Rezerviraj termin konzultacije</a></p>`
      : "<p>Odgovorit ćemo vam e-poštom radi dogovora termina.</p>";
  }

  const { error: orderError } = await supabase.from("orders").insert({
    stripe_session_id: session.id,
    customer_email: email,
    product_key: productKey,
    amount_total: session.amount_total,
    currency: session.currency,
    payment_status: session.payment_status,
  });
  if (orderError) throw orderError;

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!resendKey || !from) throw new Error("Nedostaju Resend postavke.");

  const resend = new Resend(resendKey);
  const result = await resend.emails.send({
    from,
    to: email,
    subject: `Vaša kupnja — ${products[productKey].name}`,
    html: `<h1>Hvala na kupnji</h1><p>Uplata je uspješno potvrđena.</p>${deliveryHtml}<p>Marine Performance</p>`,
  });
  if (result.error) throw result.error;
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook nije konfiguriran." }, { status: 500 });

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Nedostaje potpis." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Neispravan Stripe potpis." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      await fulfill(event.data.object as Stripe.Checkout.Session);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Fulfillment error", error);
    return NextResponse.json({ error: "Obrada narudžbe nije uspjela." }, { status: 500 });
  }
}
