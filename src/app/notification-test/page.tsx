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
      // より詳細なデータを含む通知を作成
      const notificationData = {
        ...options.data,
        actionType: "test-notification",
        timestamp: Date.now(),
        customMessage:
          (options.data as Record<string, unknown>)?.customMessage ||
          "これはテスト通知からのカスタムメッセージです",
        redirectUrl:
          (options.data as Record<string, unknown>)?.redirectUrl ||
          "/notification-test",
        shouldFocus:
          (options.data as Record<string, unknown>)?.shouldFocus !== false,
        shouldOpenNewTab:
          (options.data as Record<string, unknown>)?.shouldOpenNewTab === true,
      };

      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || undefined,
        badge: options.badge || undefined,
        tag: options.tag,
        data: notificationData,
        requireInteraction: options.requireInteraction,
        silent: options.silent,
      });

      notification.onclick = () => {
        // 通知クリック時の詳細な処理
        const data = notification.data;
        console.log("通知クリック時のデータ:", data);

        // カスタムデータに基づいて処理を分岐
        if (data?.actionType === "test-notification") {
          // アプリをフォーカス
          window.focus();

          // カスタムメッセージを表示
          if (data.customMessage) {
            setResult(`通知がクリックされました: ${data.customMessage}`);
          }

          // 特定のURLに遷移する場合
          if (
            data.redirectUrl &&
            data.redirectUrl !== window.location.pathname
          ) {
            window.location.href = data.redirectUrl;
          }

          // 新しいタブを開く場合
          if (data.shouldOpenNewTab) {
            window.open(data.redirectUrl || "/", "_blank");
          }
        }

        notification.close();
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

              {/* クリック時の動作設定 */}
              <div>
                <h3 className="font-medium mb-2">クリック時の動作設定</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      遷移先URL
                    </label>
                    <input
                      type="text"
                      value={
                        ((options.data as Record<string, unknown>)
                          ?.redirectUrl as string) || "/"
                      }
                      onChange={(e) => {
                        const newData = {
                          ...(options.data as Record<string, unknown>),
                          redirectUrl: e.target.value,
                        };
                        handleOptionChange("data", newData);
                        setCustomData(JSON.stringify(newData, null, 2));
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="/"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="shouldFocus"
                        checked={
                          ((options.data as Record<string, unknown>)
                            ?.shouldFocus as boolean) !== false
                        }
                        onChange={(e) => {
                          const newData = {
                            ...(options.data as Record<string, unknown>),
                            shouldFocus: e.target.checked,
                          };
                          handleOptionChange("data", newData);
                          setCustomData(JSON.stringify(newData, null, 2));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="shouldFocus"
                        className="ml-2 text-sm text-gray-700"
                      >
                        ウィンドウをフォーカス
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="shouldOpenNewTab"
                        checked={
                          ((options.data as Record<string, unknown>)
                            ?.shouldOpenNewTab as boolean) === true
                        }
                        onChange={(e) => {
                          const newData = {
                            ...(options.data as Record<string, unknown>),
                            shouldOpenNewTab: e.target.checked,
                          };
                          handleOptionChange("data", newData);
                          setCustomData(JSON.stringify(newData, null, 2));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="shouldOpenNewTab"
                        className="ml-2 text-sm text-gray-700"
                      >
                        新しいタブで開く
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      カスタムメッセージ
                    </label>
                    <input
                      type="text"
                      value={
                        ((options.data as Record<string, unknown>)
                          ?.customMessage as string) || ""
                      }
                      onChange={(e) => {
                        const newData = {
                          ...(options.data as Record<string, unknown>),
                          customMessage: e.target.value,
                        };
                        handleOptionChange("data", newData);
                        setCustomData(JSON.stringify(newData, null, 2));
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="クリック時に表示されるメッセージ"
                    />
                  </div>
                </div>
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

                {/* クリック時の動作プレビュー */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">
                    クリック時の動作:
                  </h5>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">遷移先:</span>{" "}
                      {String(
                        (options.data as Record<string, unknown>)
                          ?.redirectUrl || "/"
                      )}
                    </div>
                    <div>
                      <span className="font-medium">フォーカス:</span>{" "}
                      {(options.data as Record<string, unknown>)
                        ?.shouldFocus !== false
                        ? "有効"
                        : "無効"}
                    </div>
                    <div>
                      <span className="font-medium">新しいタブ:</span>{" "}
                      {(options.data as Record<string, unknown>)
                        ?.shouldOpenNewTab === true
                        ? "有効"
                        : "無効"}
                    </div>
                    {((options.data as Record<string, unknown>)
                      ?.customMessage as string) && (
                      <div>
                        <span className="font-medium">メッセージ:</span>{" "}
                        {String(
                          (options.data as Record<string, unknown>)
                            ?.customMessage || ""
                        )}
                      </div>
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

        {/* 通知クリック後の挙動について */}
        <div className="bg-purple-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-900">
            通知クリック後の挙動
          </h2>
          <div className="space-y-4 text-sm text-purple-800">
            <div>
              <h3 className="font-medium mb-2">基本的な動作</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>既存ウィンドウのフォーカス</li>
                <li>新しいウィンドウ/タブを開く</li>
                <li>特定のURLに遷移</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">
                高度な動作（このページで実装済み）
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>カスタムデータに基づく処理分岐</li>
                <li>アプリ内の状態変更</li>
                <li>コンソールログの出力</li>
                <li>結果メッセージの表示</li>
                <li>条件付きURL遷移</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">さらに可能な動作</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>データベースの更新</li>
                <li>ローカルストレージの操作</li>
                <li>他のAPIの呼び出し</li>
                <li>通知アクション（複数ボタン）</li>
                <li>アニメーションや視覚効果</li>
                <li>音声再生</li>
                <li>バックグラウンド処理の実行</li>
              </ul>
            </div>

            <div className="bg-purple-100 p-3 rounded">
              <p className="text-xs">
                💡 <strong>ヒント:</strong>{" "}
                通知のdataプロパティにカスタム情報を含めることで、
                クリック時に様々な処理を実行できます。Service
                Workerとクライアント側の両方で
                イベントハンドラーを設定することで、より柔軟な動作を実現できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
