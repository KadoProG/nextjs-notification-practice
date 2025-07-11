import urlBase64ToUint8Array from "@/utils/urlBase64ToUint8Array";
import { useState } from "react";

export default function ValidNotificationButton() {
  const [disabled, setDisabled] = useState(false);
  const subscribe = async () => {
    setDisabled(true);
    // ブラウザの通知許可の状態をチェック
    if (Notification.permission === "denied") {
      alert(
        "通知がブロックされています。ブラウザの設定で通知を許可してください。"
      );
      setDisabled(false);
      return;
    }

    // ブラウザの通知許可をリクエスト
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("通知の許可が必要です。");
        setDisabled(false);
        return;
      }
    }

    // ブラウザの通知許可がある場合は、以降の処理を実行する
    // Service Worker が完全に登録・アクティブになるまで待機。これにより、プッシュ通知を受信できる状態になる
    const reg = await navigator.serviceWorker.ready;

    // サーバーから公開鍵を取得
    const res = await fetch("/api/push/vapid");
    // 公開鍵を取得、サーバーから取得した公開鍵を使用して、プッシュ通知を受信できるようにする
    const { publicKey } = await res.json();

    // プッシュ通知の購読
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // プッシュ通知の購読情報をサーバーに送信
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });

    alert("通知登録完了");
    setDisabled(false);
  };

  return (
    <button
      onClick={subscribe}
      disabled={disabled}
      className="p-2 bg-blue-500 text-white cursor-pointer disabled:opacity-50"
    >
      通知を有効にする
    </button>
  );
}
