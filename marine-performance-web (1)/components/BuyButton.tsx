import { ProductKey } from "@/lib/products";

export function BuyButton({ product, children }: { product: ProductKey; children: React.ReactNode }) {
  return (
    <form action="/api/checkout" method="POST">
      <input type="hidden" name="product" value={product} />
      <button className="button primary" type="submit">{children}</button>
    </form>
  );
}
