import { BuyButton } from "@/components/BuyButton";
import { products } from "@/lib/products";

export default function Home({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  return <Page searchParams={searchParams} />;
}

async function Page({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const sent = (await searchParams).sent === "1";
  return (
    <main>
      <header className="nav container">
        <a className="brand" href="#vrh"><span>MP</span> Marine Performance</a>
        <nav><a href="#usluge">Usluge</a><a href="#trgovina">Trgovina</a><a href="#kontakt">Kontakt</a></nav>
      </header>

      <section id="vrh" className="hero container">
        <div>
          <p className="eyebrow">Stvarne vještine. Sigurnije odluke. Bolja karijera.</p>
          <h1>Viši standard izvedbe u pomorstvu.</h1>
          <p className="lead">Edukacija, crew assessment i tehnička podrška za pomorce, kapetane i kompanije.</p>
          <div className="actions"><a className="button primary" href="#trgovina">Pogledaj ponudu</a><a className="button secondary" href="#kontakt">Pošalji upit</a></div>
        </div>
        <aside className="hero-card"><strong>Marine Performance Method</strong><ol><li>Procijenimo stvarne potrebe</li><li>Definiramo plan napretka</li><li>Mjerimo rezultat</li></ol></aside>
      </section>

      <section className="strip"><div className="container stats"><div><b>Online</b><span>Edukacije i vodiči</span></div><div><b>1 na 1</b><span>Stručne konzultacije</span></div><div><b>B2B</b><span>Crew i fleet podrška</span></div></div></section>

      <section id="usluge" className="section container"><p className="eyebrow">Što radimo</p><h2>Od prvog ukrcaja do dugoročnog partnerstva.</h2><div className="grid three">
        <article className="card"><h3>Crew Assessment</h3><p>Procjena praktičnih znanja, komunikacije i spremnosti kandidata za konkretnu poziciju.</p></article>
        <article className="card"><h3>Online edukacije</h3><p>Jasni programi i digitalni materijali koji rješavaju stvarne probleme na brodu.</p></article>
        <article className="card"><h3>Tehničke konzultacije</h3><p>Podrška za održavanje, nabavu dijelova, organizaciju rada i profesionalni razvoj.</p></article>
      </div></section>

      <section id="trgovina" className="section alt"><div className="container"><p className="eyebrow">Trgovina i usluge</p><h2>Započni konkretnim sljedećim korakom.</h2><div className="grid two">
        <article className="product"><span className="tag">Digitalni proizvod</span><h3>{products.ebook.name}</h3><p>{products.ebook.description}</p><strong className="price">{products.ebook.displayPrice}</strong><BuyButton product="ebook">Kupi e-knjigu</BuyButton><small>Sigurno kartično plaćanje putem Stripea.</small></article>
        <article className="product featured"><span className="tag">Individualna usluga</span><h3>{products.consultation.name}</h3><p>{products.consultation.description}</p><strong className="price">{products.consultation.displayPrice}</strong><BuyButton product="consultation">Rezerviraj konzultaciju</BuyButton><small>Termin se dogovara nakon potvrđene uplate.</small></article>
      </div></div></section>

      <section className="section container"><p className="eyebrow">Kako funkcionira</p><h2>Jednostavan prodajni funnel.</h2><div className="steps"><div><b>01</b><h3>Pronađu te</h3><p>Instagram, YouTube i sadržaj vode zainteresirane osobe na ovu stranicu.</p></div><div><b>02</b><h3>Steknu povjerenje</h3><p>Jasna ponuda, stručni sadržaj i konkretni rezultati objašnjavaju vrijednost.</p></div><div><b>03</b><h3>Kupuju</h3><p>Stripe obrađuje uplatu, a sustav automatski isporučuje proizvod ili termin.</p></div></div></section>

      <section id="kontakt" className="section dark"><div className="container contact"><div><p className="eyebrow">Kontakt</p><h2>Opiši cilj ili problem.</h2><p>Za crew assessment, poslovnu suradnju, održavanje, nabavu dijelova ili prilagođenu edukaciju.</p>{sent && <p className="success">Poruka je poslana. Hvala!</p>}</div><form className="contact-form" action="/api/contact" method="POST"><label>Ime i prezime<input name="name" required /></label><label>Email<input name="email" type="email" required /></label><label>Poruka<textarea name="message" rows={5} required /></label><button className="button primary" type="submit">Pošalji upit</button></form></div></section>

      <footer className="footer container"><span>© {new Date().getFullYear()} Marine Performance</span><div><a href="/pravni-tekstovi.html">Uvjeti, privatnost i povrati</a></div></footer>
    </main>
  );
}
