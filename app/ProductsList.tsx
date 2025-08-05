"use client";

import Link from "next/link";
import { Product } from "./product-data";
import Image from "next/image";
import { useState } from "react";

type Props = {
  products: Product[];
  initialCartProducts: Product[];
};

const ProductsList = ({ products, initialCartProducts = [] }: Props) => {
  const [cartProducts, setCartProducts] = useState(initialCartProducts);

  async function addToCart(productId: string) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + "/api/users/2/cart",
      {
        method: "POST",
        body: JSON.stringify({
          productId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const newCartProducts = await response.json();
    setCartProducts(newCartProducts);
  }

  async function removeFromCart(productId) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + "/api/users/2/cart",
      {
        method: "DELETE",
        body: JSON.stringify({
          productId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const newCartProducts = await response.json();
    setCartProducts(newCartProducts);
  }

  function isProductInCart(productId: string) {
    return cartProducts.some((p) => p.id === productId);
  }

  return (
    <>
      <ul className="container flex flex-col md:flex-row mt-6 mx-auto w-7xl gap-4 p-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`products/${product.id}`}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
          >
            <Image
              src={`/${product.imageUrl}`}
              width={300}
              height={200}
              alt={product.name}
              className="aspect-square object-cover"
            />
            <div className="product-details mt-6">
              <h3 className="text-2xl font-extrabold text-black">
                {product.name}
              </h3>
              <p className="text-black">${product.price}</p>
              {isProductInCart(product.id) ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromCart(product.id);
                  }}
                >
                  Remove
                </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product.id);
                  }}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </Link>
        ))}
      </ul>
    </>
  );
};

export default ProductsList;
