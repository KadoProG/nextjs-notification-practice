let subscriptions: any[] = []; // 本番ではDBに保存してください

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);
  subscriptions.push(body);
  return Response.json({ status: "subscribed" });
}
