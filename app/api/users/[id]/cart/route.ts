import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";
//type ShoppingCart = Record<string, string[]>

// const carts: ShoppingCart = {
//   '1': ['123', '234'],
//   '2': ['345', '456'],
//   '3': ['234'],
// }

type Params = {
  id: string
}

export async function GET(request: NextRequest, { params }: { params: Params}) {
  const userId = params.id;
  const { db } = await connectToDb(); 
  //const currentUserCart = carts.find(cart => cart.id === userId);
  const userCart = await db.collection('carts').findOne({ userId });

  if(!userCart) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
  const cartIds = userCart.cartIds;
  const cartItems = await db.collection('products').find({id : { $in: cartIds } } ).toArray();

  return new Response(JSON.stringify(cartItems), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  })
}

type CartBody = {
  productId: string;
}

export async function POST(request: NextRequest, { params }:{ params: Params }) {
  const userId = params.id;
  const body: CartBody = await request.json();
  const productId = body.productId;

  // carts[userId] = carts[userId] ? carts[userId].concat(productId) : [productId];
  // userId is being used as the index to find the user position in the carts object
  // For a new item, if the user exists attach the new product to the exist array, else 
  // Just add the new array the item

  const { db } = await connectToDb();
  const updatedCart = await db.collection('carts').findOneAndUpdate(
    { userId },
    { $push: { cartIds : productId }},
    { upsert: true, returnDocument: 'after'}
  )
  const cartIds = updatedCart.cartIds;
  const cartItems = await db.collection('products').find({id: { $in: cartIds }}).toArray();
  // If we find the user's cart item ids in the colletion of products return it in the cartItems 
  // array

  return new Response(JSON.stringify(cartItems), {
    status: 201,
    headers: {
        "Content-Type": "application/json"
    }
  })


}

export async function DELETE(request: NextRequest, { params }:{ params: Params}) {

  const userId = params.id;
  const body = await request.json();
  // Gave the Body variable a type called CartBody
  // Took the request, added a json format to it and stored it in the Body object. 
  // Because request.json is a promise we have to use "await"
  const productId = body.productId;
  // Create a productId variable to store the Body.productId value
  const { db } = await connectToDb();

  const updatedCart = await db.collection('carts').findOneAndUpdate(
    { userId },
    { $pull: { cartIds: productId } },
    { returnDocument: 'after'}
  );
    
  if(!updatedCart) {
    return new Response(JSON.stringify([]),{
      status: 202,
      headers: {
      "Content-Type": "application/json"
    }
    })
  } 
  
  //carts[userId] = carts[userId].splice(carts[userId].indexOf(productId), 1);
  // Return all items into the array if it doesn't match productId
  // Took the new cartItems and used its value to find the them inside of the product collection
  // only remove that one item

  const cartItems = await db.collection('products').find({id: { $in: updatedCart.cartIds }}).toArray();

  return new Response(JSON.stringify(cartItems),{
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
  
}