import NotFoundPage from "@/app/not-found";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_SITE_URL + "/api/products/" + params.id
  );
  const product = await res.json();

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <>
      <div className="container flex flex-col md:flex-row mt-6 mx-auto w-7xl gap-4 p-8">
        <Image
          src={`/${product.imageUrl}`}
          width={600}
          height={600}
          alt={product.name}
        />
        <div>
          <h1 className="mb-4 text-4xl font-extrabold">{product.name}</h1>
          <p className="text-2xl mb-6">${product.price}</p>
          <div className="">
            <h3 className="text-2xl font-extrabold">Description</h3>
            {product.description}
          </div>
        </div>
      </div>
    </>
  );
}
