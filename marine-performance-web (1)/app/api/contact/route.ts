import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    if (!name || !email || !message) return NextResponse.json({ error: "Ispunite sva polja." }, { status: 400 });

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    const owner = process.env.OWNER_EMAIL;
    if (!apiKey || !from || !owner) throw new Error("Email nije konfiguriran.");

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: owner,
      replyTo: email,
      subject: `Novi upit: ${name}`,
      text: `Ime: ${name}\nEmail: ${email}\n\n${message}`,
    });
    if (error) throw error;
    return NextResponse.redirect(new URL("/?sent=1#kontakt", request.url), 303);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Poruka nije poslana." }, { status: 500 });
  }
}
