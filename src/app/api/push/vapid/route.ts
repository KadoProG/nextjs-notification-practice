import { getVapidKeys } from "@/utils/vapid";

export async function GET() {
  const { publicKey } = getVapidKeys();
  return Response.json({ publicKey });
}
