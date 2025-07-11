"use client";

import ValidNotificationButton from "@/components/ValidNotificationButton";
import SendNotificationButton from "@/components/SendNotificationButton";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import useNotificationPermission from "@/hooks/useNotificationPermission";

const messages = {
  default: "通知の許可状態が未設定です",
  granted: "通知が許可されています（ブラウザでの設定変更が必要です）",
  denied: "通知がブロックされています（ブラウザでの設定変更が必要です）",
};

export default function HomePage() {
  const { permission } = useNotificationPermission();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          PWA プッシュ通知テスト
        </h1>

        {/* 通知状態表示 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">通知状態</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              現在の状態: <span className="font-medium">{permission}</span>
            </p>
            <p className="text-sm text-gray-700">{messages[permission]}</p>
          </div>
        </div>

        {/* 通知設定 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">通知設定</h2>
          <p className="text-sm text-gray-600 mb-4">
            プッシュ通知を受信するには、まず通知を有効にしてください。
          </p>
          <ValidNotificationButton />
        </div>

        {/* 通知送信 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">通知送信テスト</h2>
          <p className="text-sm text-gray-600 mb-4">
            通知が有効になっている場合、テスト通知を送信できます。
          </p>
          <SendNotificationButton />
        </div>

        {/* 購読状況 */}
        <SubscriptionStatus />

        {/* 使用方法 */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">使用方法</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>「通知を有効にする」ボタンをクリックして通知を許可</li>
            <li>「通知を送信」ボタンをクリックしてテスト通知を送信</li>
            <li>通知が表示されることを確認</li>
            <li>通知をクリックするとアプリが開きます</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
