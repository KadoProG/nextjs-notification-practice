import { useState } from "react";

interface UnsubscribeButtonProps {
  endpoint: string;
  onUnsubscribed?: () => void;
}

export default function UnsubscribeButton({
  endpoint,
  onUnsubscribed,
}: UnsubscribeButtonProps) {
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUnsubscribe = async () => {
    if (!confirm("この購読を解除しますか？")) {
      return;
    }

    setIsUnsubscribing(true);
    setResult(null);

    try {
      const response = await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult("購読を解除しました");
        onUnsubscribed?.();
      } else {
        setResult(`エラー: ${data.error || "解除に失敗しました"}`);
      }
    } catch (error) {
      setResult(
        `エラー: ${
          error instanceof Error ? error.message : "解除に失敗しました"
        }`
      );
    } finally {
      setIsUnsubscribing(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleUnsubscribe}
        disabled={isUnsubscribing}
        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isUnsubscribing ? "解除中..." : "解除"}
      </button>

      {result && (
        <div
          className={`text-xs p-1 rounded ${
            result.includes("エラー")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {result}
        </div>
      )}
    </div>
  );
}
