# Marine Performance — prodajna web stranica

Funkcionalni MVP napravljen u Next.jsu. Sadrži landing stranicu, prodaju e-knjige i konzultacije, Stripe Checkout, Stripe webhook, privatnu isporuku e-knjige preko Supabase Storagea, e-mail isporuku preko Resenda i kontakt obrazac.

## 1. Lokalno pokretanje

Instaliraj Node.js LTS i u terminalu pokreni:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Otvori `http://localhost:3000`.

## 2. Stripe

1. Otvori Stripe račun i dovrši provjeru poslovnog subjekta i bankovnog računa.
2. U Stripe Dashboardu kreiraj dva proizvoda i jednokratne cijene u EUR:
   - Marine Performance e-knjiga
   - Pomorska konzultacija 60 min
3. Kopiraj Price ID vrijednosti u `.env.local`.
4. Za testiranje koristi testne ključeve.
5. Nakon objave dodaj webhook adresu: `https://TVOJA-DOMENA/api/stripe-webhook`.
6. Odaberi događaje `checkout.session.completed` i `checkout.session.async_payment_succeeded`.
7. Kopiraj webhook signing secret u `STRIPE_WEBHOOK_SECRET`.

## 3. Supabase

1. Kreiraj Supabase projekt.
2. U SQL Editoru izvrši sadržaj `docs/supabase.sql`.
3. U Storageu kreiraj PRIVATNI bucket `paid-downloads`.
4. U njega učitaj PDF na putanju `ebooks/marine-performance-guide.pdf`.
5. Project URL i service role key spremi u environment variables. Service role key nikad ne stavljaj u frontend ili javni repozitorij.

## 4. Resend

1. Kreiraj račun i API ključ.
2. Verificiraj svoju domenu.
3. Postavi `RESEND_API_KEY`, `EMAIL_FROM` i `OWNER_EMAIL`.

## 5. Booking

Kreiraj Cal.com ili Calendly termin i postavi `BOOKING_URL`. Kupac konzultacije dobiva taj link nakon uspješne naplate.

## 6. Objava na Vercelu

1. Kreiraj GitHub repozitorij i učitaj ovaj projekt.
2. U Vercelu odaberi Add New Project i poveži GitHub repozitorij.
3. Dodaj sve vrijednosti iz `.env.example` u Vercel Environment Variables.
4. Deploy.
5. Postavi `NEXT_PUBLIC_SITE_URL` na produkcijsku domenu i napravi redeploy.
6. Dodaj Stripe webhook tek nakon što dobiješ produkcijsku domenu.

## 7. Domena

Kupi domenu, primjerice `marineperformance.hr` ili `.com`, i poveži DNS zapise s Vercelom. Zatim verificiraj istu domenu u Resendu.

## 8. Prije stvarne prodaje

- Registriraj odgovarajući oblik poslovanja i koristi poslovni bankovni račun.
- S računovođom provjeri račune, PDV, fiskalizaciju, evidencije i prekograničnu prodaju digitalnog sadržaja.
- Dopuni pravne tekstove stvarnim podacima trgovca.
- Uredi pravila reklamacija, privatnosti, kolačića i prava potrošača.
- Provjeri treba li ti sustav za automatsko izdavanje/fiskalizaciju računa i integriraj ga prije live naplate.
- Nikada ne aktiviraj Stripe live mode dok testna kupnja, webhook, e-mail i preuzimanje nisu uspješno provjereni.

## Promjena teksta i cijena

Tekstovi i prikazane cijene su u `lib/products.ts` i `app/page.tsx`. Stvarna naplata uvijek koristi cijenu definiranu u Stripe Dashboardu; prikazana cijena mora joj odgovarati.
