import { subscriptionStore } from "@/utils/subscriptionStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = subscriptionStore.addSubscription(body);
    console.log("送信された");
    console.log(subscriptionStore.getAllSubscriptions());

    return Response.json({
      status: "subscribed",
      total: result.total,
      isNew: result.isNew,
    });
  } catch (error) {
    console.error("通知購読エラー:", error);
    return Response.json(
      { error: "通知購読の処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// 購読状況を確認するためのGETエンドポイント
export async function GET() {
  const subscriptions = subscriptionStore.getAllSubscriptions();

  return Response.json({
    total: subscriptionStore.getSubscriptionCount(),
    subscriptions: subscriptions.map((sub) => ({
      endpoint: sub.endpoint,
      // セキュリティのため、キーは返さない
    })),
  });
}
