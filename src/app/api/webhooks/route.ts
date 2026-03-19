export async function POST() {
  return new Response("Clerk webhooks are no longer configured.", {
    status: 410,
  });
}
