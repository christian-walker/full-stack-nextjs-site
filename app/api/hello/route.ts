export async function GET() {
  return new Response(JSON.stringify({message: 'This is from Next.js, my hello router'}), {
    status: 200
  });
}

export async function POST() {
  return new Response('Thank you for posting this!', {
    status: 200
  });
}