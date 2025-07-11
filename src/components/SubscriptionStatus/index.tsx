import { useState, useEffect } from "react";
import UnsubscribeButton from "@/components/UnsubscribeButton";

interface SubscriptionInfo {
  total: number;
  subscriptions: Array<{
    endpoint: string;
  }>;
}

export default function SubscriptionStatus() {
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/push/subscribe");
      if (response.ok) {
        const data = await response.json();
        setSubscriptionInfo(data);
      } else {
        setError("購読状況の取得に失敗しました");
      }
    } catch {
      setError("購読状況の取得中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const handleUnsubscribed = () => {
    // 購読解除後にリストを更新
    fetchSubscriptionStatus();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">購読状況</h2>
        <button
          onClick={fetchSubscriptionStatus}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          {loading ? "更新中..." : "更新"}
        </button>
      </div>

      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      {subscriptionInfo && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">登録済み購読者:</span>
            <span className="font-medium">{subscriptionInfo.total}人</span>
          </div>

          {subscriptionInfo.total > 0 && (
            <div className="text-xs text-gray-500">
              <p className="mb-2">購読エンドポイント:</p>
              {subscriptionInfo.subscriptions.map((sub, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded mb-2">
                  <div className="flex items-center justify-between">
                    <div className="break-all flex-1 mr-2">{sub.endpoint}</div>
                    <UnsubscribeButton
                      endpoint={sub.endpoint}
                      onUnsubscribed={handleUnsubscribed}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {subscriptionInfo.total === 0 && (
            <p className="text-sm text-gray-500">
              現在、登録されている購読者がいません。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
