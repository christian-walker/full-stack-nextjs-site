"use client";
import Link from "next/link";
import { useState } from "react";

export default function ShoppingCartList({
  initialCartProducts,
}: {
  initialCartProducts: Product[];
}) {
  const [cartProducts, setCartProducts] = useState(initialCartProducts);

  async function removeFromCart(productId: string) {
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

  return (
    <>
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        <ul className="space-y-4">
          {cartProducts.map((cartItem) => (
            <li
              key={cartItem?.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
            >
              <Link href={`/products/${cartItem.id}`}>
                <h3 className="text-xl font-semibold mb-2">{cartItem.name}</h3>
                <p className="text-gray-600">${cartItem.price}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromCart(cartItem.id);
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-100"
                >
                  Remove
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
