import { NextRequest } from "next/server";
import { connectToDb } from "../../db";

interface Params {
  id: string
}

export async function GET(request: NextRequest, { params }: { params: Params}) {
  
  const { db } = await connectToDb();
  const productId = params.id;
  //const currentProduct = products.find(product => product.id === productId);
  const currProduct = await db.collection('products').findOne({ id: productId });

  if(!currProduct) {
    return new Response('Product Not Found.',{
      status: 404
    });
  }
  return new Response(JSON.stringify(currProduct), {
    status: 200,
    headers: {
      "content-type": "applications/json",
    }
  })
}