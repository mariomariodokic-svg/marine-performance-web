import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Nedostaje STRIPE_SECRET_KEY");
  return new Stripe(key);
}
