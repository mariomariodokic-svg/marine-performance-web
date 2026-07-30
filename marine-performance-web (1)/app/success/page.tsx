import Link from "next/link";
import { getStripe } from "@/lib/stripe";

export default async function Success({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const sessionId = (await searchParams).session_id;
  let paid = false;
  let email: string | null = null;
  if (sessionId) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      email = session.customer_details?.email ?? null;
    } catch {}
  }
  return <main className="status-page"><div className="status-card"><p className="eyebrow">{paid ? "Uplata potvrđena" : "Obrada uplate"}</p><h1>{paid ? "Hvala na kupnji." : "Provjeravamo status plaćanja."}</h1><p>{paid ? `Upute su poslane na ${email ?? "vašu e-adresu"}.` : "Ako ste platili metodom s odgodom, potvrda će stići nakon konačne obrade."}</p><Link className="button primary" href="/">Povratak na početnu</Link></div></main>;
}
