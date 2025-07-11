export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// グローバル変数として定義（Next.jsのモジュールキャッシュ問題を回避）
declare global {
  var __subscriptions: PushSubscription[] | undefined;
}

// グローバル変数を使用してストレージを初期化
if (!global.__subscriptions) {
  global.__subscriptions = [];
}

const subscriptions = global.__subscriptions;

// デバッグ用: ストレージの状態をログ出力
const logStorageState = (action: string) => {
  console.log(
    `[subscriptionStore] ${action} - 現在の購読数: ${subscriptions.length}`
  );
  console.log(`[subscriptionStore] 購読データ:`, subscriptions);
  console.log(
    `[subscriptionStore] グローバル変数参照:`,
    global.__subscriptions === subscriptions
  );
};

export const subscriptionStore = {
  // 購読を追加または更新
  addSubscription(subscription: PushSubscription): {
    isNew: boolean;
    total: number;
  } {
    logStorageState("addSubscription開始");

    const existingIndex = subscriptions.findIndex(
      (sub) => sub.endpoint === subscription.endpoint
    );

    if (existingIndex === -1) {
      // 新しい購読
      subscriptions.push(subscription);
      console.log("新しい通知購読を登録:", subscription.endpoint);
      logStorageState("addSubscription完了（新規）");
      return { isNew: true, total: subscriptions.length };
    } else {
      // 既存の購読を更新
      subscriptions[existingIndex] = subscription;
      console.log("既存の通知購読を更新:", subscription.endpoint);
      logStorageState("addSubscription完了（更新）");
      return { isNew: false, total: subscriptions.length };
    }
  },

  // 購読を削除
  removeSubscription(endpoint: string): boolean {
    logStorageState("removeSubscription開始");

    const index = subscriptions.findIndex((sub) => sub.endpoint === endpoint);
    if (index !== -1) {
      subscriptions.splice(index, 1);
      console.log("通知購読を削除:", endpoint);
      logStorageState("removeSubscription完了");
      return true;
    }
    logStorageState("removeSubscription完了（見つからない）");
    return false;
  },

  // すべての購読を取得
  getAllSubscriptions(): PushSubscription[] {
    logStorageState("getAllSubscriptions");
    return [...subscriptions];
  },

  // 購読数を取得
  getSubscriptionCount(): number {
    const count = subscriptions.length;
    console.log(`[subscriptionStore] getSubscriptionCount: ${count}`);
    return count;
  },

  // 特定のエンドポイントの購読を取得
  getSubscription(endpoint: string): PushSubscription | undefined {
    return subscriptions.find((sub) => sub.endpoint === endpoint);
  },

  // すべての購読をクリア（テスト用）
  clearAll(): void {
    subscriptions.length = 0;
    console.log("すべての通知購読をクリアしました");
    logStorageState("clearAll");
  },
};
