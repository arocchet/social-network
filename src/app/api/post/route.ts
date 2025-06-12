export function POST(request: Request) {
  return new Response("Hello from POST route", {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
