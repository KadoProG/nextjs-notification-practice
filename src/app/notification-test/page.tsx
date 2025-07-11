"use client";

import { useState } from "react";
import useNotificationPermission from "@/hooks/useNotificationPermission";

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, unknown>;
  requireInteraction: boolean;
  silent: boolean;
  vibrate?: number[];
  actions?: NotificationAction[];
  dir?: "auto" | "ltr" | "rtl";
  lang?: string;
  renotify: boolean;
  timestamp?: number;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

const defaultOptions: NotificationOptions = {
  title: "テスト通知",
  body: "これはテスト通知です",
  icon: "/next.svg",
  badge: "/next.svg",
  image: "",
  tag: "test-notification",
  data: { url: "/" },
  requireInteraction: false,
  silent: false,
  vibrate: [200, 100, 200],
  actions: [
    {
      action: "view",
      title: "表示",
      icon: "/next.svg",
    },
    {
      action: "close",
      title: "閉じる",
    },
  ],
  dir: "auto",
  lang: "ja",
  renotify: false,
  timestamp: Date.now(),
};

export default function NotificationTestPage() {
  const { permission } = useNotificationPermission();
  const [options, setOptions] = useState<NotificationOptions>(defaultOptions);
  const [customData, setCustomData] = useState('{"key": "value"}');
  const [result, setResult] = useState<string>("");

  const handleOptionChange = (
    key: keyof NotificationOptions,
    value: unknown
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleDataChange = (value: string) => {
    setCustomData(value);
    try {
      const parsed = JSON.parse(value);
      handleOptionChange("data", parsed);
    } catch {
      // JSONが無効な場合は無視
    }
  };

  const sendNotification = () => {
    if (permission !== "granted") {
      setResult("通知が許可されていません");
      return;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || undefined,
        badge: options.badge || undefined,
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction,
        silent: options.silent,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        setResult("通知がクリックされました");
      };

      notification.onclose = () => {
        setResult("通知が閉じられました");
      };

      notification.onshow = () => {
        setResult("通知が表示されました");
      };

      setResult("通知を送信しました");
    } catch (error) {
      setResult(
        `エラー: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const resetOptions = () => {
    setOptions(defaultOptions);
    setCustomData('{"key": "value"}');
    setResult("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Notification パラメータテスト
        </h1>

        {/* 通知状態 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">通知状態</h2>
          <p className="text-sm text-gray-600">
            現在の状態: <span className="font-medium">{permission}</span>
          </p>
          {permission !== "granted" && (
            <p className="text-red-600 text-sm mt-2">
              通知をテストするには、まず通知を許可してください。
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* パラメータ設定 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">通知パラメータ</h2>

            <div className="space-y-4">
              {/* 基本設定 */}
              <div>
                <h3 className="font-medium mb-2">基本設定</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      タイトル
                    </label>
                    <input
                      type="text"
                      value={options.title}
                      onChange={(e) =>
                        handleOptionChange("title", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      本文
                    </label>
                    <textarea
                      value={options.body}
                      onChange={(e) =>
                        handleOptionChange("body", e.target.value)
                      }
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      アイコンURL
                    </label>
                    <input
                      type="text"
                      value={options.icon || ""}
                      onChange={(e) =>
                        handleOptionChange("icon", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      バッジURL
                    </label>
                    <input
                      type="text"
                      value={options.badge || ""}
                      onChange={(e) =>
                        handleOptionChange("badge", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      画像URL
                    </label>
                    <input
                      type="text"
                      value={options.image || ""}
                      onChange={(e) =>
                        handleOptionChange("image", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      タグ
                    </label>
                    <input
                      type="text"
                      value={options.tag || ""}
                      onChange={(e) =>
                        handleOptionChange("tag", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 動作設定 */}
              <div>
                <h3 className="font-medium mb-2">動作設定</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireInteraction"
                      checked={options.requireInteraction}
                      onChange={(e) =>
                        handleOptionChange(
                          "requireInteraction",
                          e.target.checked
                        )
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="requireInteraction"
                      className="ml-2 text-sm text-gray-700"
                    >
                      ユーザーが手動で閉じるまで表示
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="silent"
                      checked={options.silent}
                      onChange={(e) =>
                        handleOptionChange("silent", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="silent"
                      className="ml-2 text-sm text-gray-700"
                    >
                      サイレント通知（音を鳴らさない）
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="renotify"
                      checked={options.renotify}
                      onChange={(e) =>
                        handleOptionChange("renotify", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="renotify"
                      className="ml-2 text-sm text-gray-700"
                    >
                      同じタグの通知でも再通知
                    </label>
                  </div>
                </div>
              </div>

              {/* データ */}
              <div>
                <h3 className="font-medium mb-2">カスタムデータ (JSON)</h3>
                <textarea
                  value={customData}
                  onChange={(e) => handleDataChange(e.target.value)}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder='{"key": "value"}'
                />
              </div>
            </div>
          </div>

          {/* プレビューと実行 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">プレビュー & 実行</h2>

            {/* プレビュー */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">通知プレビュー</h3>
              <div className="bg-gray-100 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-start space-x-3">
                  {options.icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={options.icon}
                      alt="icon"
                      className="w-8 h-8 rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {options.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{options.body}</p>
                    {options.tag && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                        {options.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 実行ボタン */}
            <div className="space-y-4">
              <button
                onClick={sendNotification}
                disabled={permission !== "granted"}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                通知を送信
              </button>

              <button
                onClick={resetOptions}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                設定をリセット
              </button>
            </div>

            {/* 結果表示 */}
            {result && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">{result}</p>
              </div>
            )}
          </div>
        </div>

        {/* 使用方法 */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">使用方法</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>左側のフォームで通知のパラメータを設定</li>
            <li>右側のプレビューで通知の見た目を確認</li>
            <li>「通知を送信」ボタンをクリックして実際の通知をテスト</li>
            <li>通知をクリックするとイベントが記録されます</li>
            <li>「設定をリセット」でデフォルト値に戻せます</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
