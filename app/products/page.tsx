// import { products } from "../product-data";
import ProductsList from "../ProductsList";

export const dynamic = "force-dynamic";

export default async function ProductListPage() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_SITE_URL + "/api/products"
  );

  const response2 = await fetch(
    process.env.NEXT_PUBLIC_SITE_URL + "/api/users/2/cart"
  );

  const products = await response.json();
  const cartProducts = await response2.json();

  return (
    <>
      <h1>Product Lising Page</h1>
      <ProductsList products={products} initialCartProducts={cartProducts} />
    </>
  );
}
