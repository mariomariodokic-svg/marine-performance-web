import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getStripePriceId, products, ProductKey } from "@/lib/products";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const productKey = String(formData.get("product")) as ProductKey;

    if (!(productKey in products)) {
      return NextResponse.json({ error: "Nepoznat proizvod." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) throw new Error("Nedostaje NEXT_PUBLIC_SITE_URL");

    const product = products[productKey];
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: getStripePriceId(productKey), quantity: 1 }],
      customer_creation: "always",
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      allow_promotion_codes: true,
      metadata: { productKey },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
    });

    if (!session.url) throw new Error("Stripe nije vratio adresu za plaćanje.");
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Plaćanje se trenutačno ne može pokrenuti." }, { status: 500 });
  }
}
