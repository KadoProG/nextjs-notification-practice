"use client";

import { useState, useEffect } from "react";

export default function NotificationSettings() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 通知がサポートされているかチェック
    setIsSupported("Notification" in window);

    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  const openNotificationSettings = () => {
    // ブラウザの通知設定ページを開く
    if (navigator.userAgent.includes("Chrome")) {
      // Chromeの場合
      window.open("chrome://settings/content/notifications", "_blank");
    } else if (navigator.userAgent.includes("Firefox")) {
      // Firefoxの場合
      window.open("about:preferences#privacy", "_blank");
    } else if (navigator.userAgent.includes("Safari")) {
      // Safariの場合
      alert(
        "Safariの通知設定は「Safari」→「環境設定」→「通知」で変更できます。"
      );
    } else {
      alert("ブラウザの設定から通知の許可を確認してください。");
    }
  };

  const testLocalNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("ローカル通知テスト", {
        body: "これはローカル通知のテストです",
        icon: "/next.svg",
        badge: "/next.svg",
        tag: "test-local",
        requireInteraction: true,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">通知設定</h2>

      <div className="space-y-4">
        {/* 通知サポート状況 */}
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">
            通知サポート:{" "}
            <span className="font-medium">
              {isSupported ? "✅ サポート済み" : "❌ サポートされていません"}
            </span>
          </p>
        </div>

        {/* 現在の許可状態 */}
        <div className="p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            現在の許可状態: <span className="font-medium">{permission}</span>
          </p>
          {permission === "default" && (
            <p className="text-xs text-blue-600 mt-1">
              通知を有効にするには、下のボタンをクリックしてください。
            </p>
          )}
          {permission === "denied" && (
            <p className="text-xs text-red-600 mt-1">
              通知がブロックされています。ブラウザの設定で許可してください。
            </p>
          )}
        </div>

        {/* アクションボタン */}
        <div className="space-y-2">
          {permission === "default" && (
            <button
              onClick={requestPermission}
              className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              通知を許可する
            </button>
          )}

          {permission === "granted" && (
            <button
              onClick={testLocalNotification}
              className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              ローカル通知をテスト
            </button>
          )}

          <button
            onClick={openNotificationSettings}
            className="w-full p-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            ブラウザの通知設定を開く
          </button>
        </div>

        {/* 通知の確認方法 */}
        <div className="p-3 bg-yellow-50 rounded">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            通知の確認方法：
          </h3>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• デスクトップの右下に通知がポップアップ表示されます</li>
            <li>• 通知センター（ベルアイコン）で過去の通知を確認できます</li>
            <li>• 通知をクリックするとアプリが開きます</li>
            <li>
              •
              通知の「開く」ボタンでアプリを開く、「閉じる」ボタンで通知を閉じます
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
