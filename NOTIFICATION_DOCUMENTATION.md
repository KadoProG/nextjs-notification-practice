# PWA プッシュ通知機能 ドキュメント

## 概要

このプロジェクトは、Next.js 15 と React 19 を使用した PWA（Progressive Web App）のプッシュ通知機能を実装しています。Web Push API を使用して、ブラウザが閉じられていてもユーザーに通知を送信できる機能を提供します。

## 機能一覧

### 1. 通知許可管理

- ブラウザの通知許可状態の確認
- 通知許可の要求
- ブラウザ設定への誘導

### 2. プッシュ通知購読

- Service Worker 登録
- プッシュ通知の購読登録
- 購読状況の管理

### 3. 通知送信

- サーバーサイドからの通知送信
- 複数ユーザーへの一括送信
- 通知結果の追跡

### 4. 通知表示

- リッチな通知内容（タイトル、本文、アイコン、画像）
- 通知アクション（開く、閉じる）
- 通知クリック時のアプリ起動

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **プッシュ通知**: Web Push API, web-push ライブラリ
- **Service Worker**: カスタム実装
- **状態管理**: React Hooks

## アーキテクチャ

### ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/push/          # プッシュ通知API
│   │   ├── subscribe/     # 購読登録
│   │   ├── send/          # 通知送信
│   │   ├── unsubscribe/   # 購読解除
│   │   └── vapid/         # VAPID鍵取得
│   ├── layout.tsx         # レイアウト
│   └── page.tsx           # メインページ
├── components/            # React コンポーネント
│   ├── NotificationSettings/    # 通知設定
│   ├── SendNotificationButton/  # 通知送信ボタン
│   ├── ServiceWorker/           # Service Worker登録
│   ├── SubscriptionStatus/      # 購読状況表示
│   ├── UnsubscribeButton/       # 購読解除ボタン
│   └── ValidNotificationButton/ # 有効通知ボタン
├── hooks/                 # カスタムフック
│   └── useNotificationPermission.ts
└── utils/                 # ユーティリティ
    ├── subscriptionStore.ts      # 購読管理
    ├── urlBase64ToUint8Array.ts  # エンコーディング変換
    └── vapid.ts                  # VAPID鍵管理
```

## 主要コンポーネント詳細

### 1. NotificationSettings コンポーネント

**ファイル**: `src/components/NotificationSettings/index.tsx`

通知の許可状態を管理し、ユーザーに通知設定を提供します。

#### 機能

- 通知サポート状況の確認
- 現在の許可状態の表示
- 通知許可の要求
- ブラウザ設定への誘導
- ローカル通知のテスト

#### 主要な状態

- `permission`: 現在の通知許可状態
- `isSupported`: 通知 API のサポート状況

#### 主要な関数

```typescript
const requestPermission = async () => {
  if ("Notification" in window) {
    const result = await Notification.requestPermission();
    setPermission(result);
  }
};
```

### 2. SendNotificationButton コンポーネント

**ファイル**: `src/components/SendNotificationButton/index.tsx`

サーバーサイドからプッシュ通知を送信する機能を提供します。

#### 機能

- 通知送信の実行
- 送信状態の管理
- 送信結果の表示

#### 主要な状態

- `isSending`: 送信中かどうか
- `lastResult`: 最後の送信結果

### 3. ServiceWorker コンポーネント

**ファイル**: `src/components/ServiceWorker/index.tsx`

Service Worker の登録を管理します。

#### 機能

- Service Worker の自動登録
- 登録状況のログ出力

## API エンドポイント

### 1. 購読登録 API

**エンドポイント**: `POST /api/push/subscribe`

#### 機能

- プッシュ通知の購読を登録
- 既存購読の更新
- 購読状況の確認

#### リクエスト例

```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "base64-encoded-p256dh-key",
    "auth": "base64-encoded-auth-key"
  }
}
```

#### レスポンス例

```json
{
  "status": "subscribed",
  "total": 1,
  "isNew": true
}
```

### 2. 通知送信 API

**エンドポイント**: `POST /api/push/send`

#### 機能

- 登録済みユーザーへの通知送信
- 送信結果の追跡
- エラーハンドリング

#### レスポンス例

```json
{
  "status": "sent",
  "total": 1,
  "successful": 1,
  "failed": 0,
  "results": [
    {
      "success": true,
      "index": 0
    }
  ]
}
```

### 3. 購読状況確認 API

**エンドポイント**: `GET /api/push/subscribe`

#### 機能

- 登録済み購読の一覧取得
- 購読数の確認

## Service Worker

**ファイル**: `public/sw.js`

### 主要なイベントハンドラー

#### 1. push イベント

```javascript
self.addEventListener("push", function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || "/next.svg",
    badge: data.badge || "/next.svg",
    tag: data.tag || "default",
    data: data.data || {},
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: "open",
        title: "開く",
        icon: "/next.svg",
      },
      {
        action: "close",
        title: "閉じる",
      },
    ],
    image: data.image,
    timestamp: Date.now(),
    priority: "high",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
```

#### 2. notificationclick イベント

```javascript
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function (clientList) {
      // 既存ウィンドウのフォーカスまたは新規ウィンドウを開く
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        const urlToOpen = event.notification.data?.url || "/";
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
```

## ユーティリティ

### 1. subscriptionStore

**ファイル**: `src/utils/subscriptionStore.ts`

購読情報の管理を行うユーティリティです。

#### 主要な関数

- `addSubscription()`: 購読の追加・更新
- `removeSubscription()`: 購読の削除
- `getAllSubscriptions()`: 全購読の取得
- `getSubscriptionCount()`: 購読数の取得

### 2. VAPID 鍵管理

**ファイル**: `src/utils/vapid.ts`

VAPID（Voluntary Application Server Identification）鍵の管理を行います。

#### 環境変数

- `VAPID_PUBLIC_KEY`: 公開鍵
- `VAPID_PRIVATE_KEY`: 秘密鍵

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. VAPID 鍵の生成

```bash
npx web-push generate-vapid-keys
```

### 3. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

## 使用方法

### 1. 通知の有効化

1. アプリケーションにアクセス
2. 「通知を許可する」ボタンをクリック
3. ブラウザの通知許可ダイアログで「許可」を選択

### 2. 通知の送信

1. 「通知を送信」ボタンをクリック
2. 送信結果を確認

### 3. 通知の確認

- デスクトップの右下に通知が表示されます
- 通知センターで過去の通知を確認できます
- 通知をクリックするとアプリが開きます

## ブラウザサポート

### 対応ブラウザ

- Chrome 42+
- Firefox 44+
- Safari 16+
- Edge 17+

### 制限事項

- HTTPS 環境でのみ動作
- Service Worker のサポートが必要
- Web Push API のサポートが必要

## トラブルシューティング

### よくある問題

#### 1. 通知が表示されない

- ブラウザの通知許可を確認
- Service Worker が正常に登録されているか確認
- HTTPS 環境で動作しているか確認

#### 2. 購読登録に失敗する

- VAPID 鍵が正しく設定されているか確認
- 環境変数が読み込まれているか確認

#### 3. 通知送信に失敗する

- 購読者が登録されているか確認
- サーバーログでエラー詳細を確認

## セキュリティ考慮事項

### 1. VAPID 鍵の管理

- 秘密鍵は絶対に公開しない
- 環境変数で安全に管理
- 本番環境では専用の鍵を使用

### 2. 購読情報の保護

- 購読情報はサーバーサイドで安全に管理
- クライアントには最小限の情報のみ公開

### 3. 通知内容の検証

- 送信前に通知内容を検証
- 悪意のあるコンテンツをフィルタリング

## パフォーマンス最適化

### 1. 通知の最適化

- 適切なタグを使用して重複通知を防止
- 通知の優先度を適切に設定
- 不要な通知を削除

### 2. 購読管理の最適化

- 無効な購読を定期的にクリーンアップ
- 購読情報の効率的な保存

## 今後の拡張予定

### 1. 機能拡張

- 通知テンプレート機能
- スケジュール通知機能
- 通知履歴管理

### 2. 改善予定

- より詳細な通知設定
- 通知の優先度管理
- 通知のグループ化

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 貢献

バグ報告や機能要望は、GitHub の Issue でお知らせください。
Pull Request も歓迎します。
