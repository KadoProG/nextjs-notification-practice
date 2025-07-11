import { subscriptionStore } from "@/utils/subscriptionStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { endpoint } = body;

    if (!endpoint) {
      return Response.json(
        { error: "エンドポイントが指定されていません" },
        { status: 400 }
      );
    }

    const removed = subscriptionStore.removeSubscription(endpoint);

    if (removed) {
      return Response.json({
        status: "unsubscribed",
        total: subscriptionStore.getSubscriptionCount(),
        message: "購読を解除しました",
      });
    } else {
      return Response.json(
        { error: "指定されたエンドポイントの購読が見つかりません" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("購読解除エラー:", error);
    return Response.json(
      { error: "購読解除の処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
