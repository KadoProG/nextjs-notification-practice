"use client";

import ValidNotificationButton from "@/components/ValidNotificationButton";
import useNotificationPermission from "@/hooks/useNotificationPermission";

const messages = {
  default: "通知の許可状態が未設定です",
  granted: "通知が許可されています（ブラウザでの設定変更が必要です）",
  denied: "通知がブロックされています（ブラウザでの設定変更が必要です）",
};

export default function HomePage() {
  const { permission } = useNotificationPermission();

  return (
    <div>
      <p>通知状態: {permission}</p>
      <p>{messages[permission]}</p>
      <ValidNotificationButton />
      <h1 className="text-2xl font-bold">やること</h1>
      <section>
        <h2>1. ブラウザの通知を有効にする</h2>
        <h2>2. </h2>
      </section>
    </div>
  );
}
