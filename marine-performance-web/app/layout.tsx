import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marine Performance | Edukacija, crew assessment i konzultacije",
  description: "Pomorska edukacija, procjena crew-a, tehničke konzultacije i praktični digitalni vodiči.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="hr"><body>{children}</body></html>;
}
