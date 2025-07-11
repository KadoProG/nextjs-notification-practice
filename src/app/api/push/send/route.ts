import { getVapidKeys } from "@/utils/vapid";
import { subscriptionStore } from "@/utils/subscriptionStore";
import webpush from "web-push";

export async function POST() {
  try {
    const subscriptions = subscriptionStore.getAllSubscriptions();
    console.log("send/route.ts - 取得した購読数:", subscriptions.length);
    console.log("send/route.ts - 購読データ:", subscriptions);

    if (subscriptions.length === 0) {
      return Response.json(
        {
          error:
            "登録された通知購読者がいません。まず通知を有効にしてください。",
        },
        { status: 400 }
      );
    }

    const { publicKey, privateKey } = getVapidKeys();

    webpush.setVapidDetails("mailto:you@example.com", publicKey, privateKey);

    // より魅力的な通知データを作成
    const currentTime = new Date();
    const payload = JSON.stringify({
      title: "🎉 新しい通知が届きました！",
      body: `こんにちは！新しいメッセージがあります。\n受信時刻: ${currentTime.toLocaleString(
        "ja-JP"
      )}`,
      icon: "/next.svg",
      badge: "/next.svg",
      image: "/globe.svg", // 画像を追加
      tag: "new-notification",
      data: {
        url: "/",
        timestamp: currentTime.getTime(),
        type: "info",
        priority: "high",
      },
      // 通知のスタイリング情報
      requireInteraction: true,
      silent: false,
      vibrate: [200, 100, 200],
      actions: [
        {
          action: "open",
          title: "開く",
          icon: "/next.svg",
        },
        {
          action: "close",
          title: "閉じる",
        },
      ],
    });

    const results = await Promise.allSettled(
      subscriptions.map((sub, index) =>
        webpush
          .sendNotification(sub, payload)
          .then(() => ({ success: true, index }))
          .catch((err) => ({
            success: false,
            index,
            error: err.message || "送信エラー",
          }))
      )
    );

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;
    const failed = results.length - successful;

    return Response.json({
      status: "sent",
      total: subscriptions.length,
      successful,
      failed,
      results: results.map((r) =>
        r.status === "fulfilled" ? r.value : { success: false, error: r.reason }
      ),
    });
  } catch (error) {
    console.error("通知送信エラー:", error);
    return Response.json(
      { error: "通知送信中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
