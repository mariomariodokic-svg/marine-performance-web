import Link from "next/link";
export default function Cancel() { return <main className="status-page"><div className="status-card"><p className="eyebrow">Plaćanje prekinuto</p><h1>Naplata nije izvršena.</h1><p>Možete se vratiti i pokušati ponovno kada budete spremni.</p><Link className="button primary" href="/#trgovina">Povratak u trgovinu</Link></div></main>; }
