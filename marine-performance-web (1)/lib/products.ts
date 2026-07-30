export type ProductKey = "ebook" | "consultation";

export const products = {
  ebook: {
    key: "ebook",
    name: "Marine Performance e-knjiga",
    description: "Praktični vodič za razvoj pomorske karijere, standarde rada i pripremu za ukrcaj.",
    displayPrice: "29 €",
    priceEnv: "STRIPE_PRICE_EBOOK",
    type: "digital" as const,
  },
  consultation: {
    key: "consultation",
    name: "Pomorska konzultacija 60 min",
    description: "Individualna analiza karijere, CV-a, pripreme za intervju ili tehničkog problema.",
    displayPrice: "149 €",
    priceEnv: "STRIPE_PRICE_CONSULTATION",
    type: "service" as const,
  },
} satisfies Record<ProductKey, {
  key: ProductKey;
  name: string;
  description: string;
  displayPrice: string;
  priceEnv: string;
  type: "digital" | "service";
}>;

export function getStripePriceId(key: ProductKey): string {
  const envName = products[key].priceEnv;
  const priceId = process.env[envName];
  if (!priceId) throw new Error(`Nedostaje varijabla ${envName}`);
  return priceId;
}
