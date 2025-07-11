import { useState } from "react";

export default function SendNotificationButton() {
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const sendNotification = async () => {
    setIsSending(true);
    setLastResult(null);

    try {
      const response = await fetch("/api/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        setLastResult(`通知送信完了！結果: ${JSON.stringify(result)}`);
      } else {
        setLastResult(`エラー: ${result.error || "送信に失敗しました"}`);
      }
    } catch (error) {
      setLastResult(
        `エラー: ${
          error instanceof Error ? error.message : "送信に失敗しました"
        }`
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={sendNotification}
        disabled={isSending}
        className="p-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSending ? "送信中..." : "通知を送信"}
      </button>

      {lastResult && (
        <div
          className={`p-3 rounded text-sm ${
            lastResult.includes("エラー")
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          {lastResult}
        </div>
      )}
    </div>
  );
}
