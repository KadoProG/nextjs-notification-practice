# PWA プッシュ通知 Next.js プロジェクト

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green)](https://web.dev/progressive-web-apps/)

Next.js 15 と React 19 を使用した PWA（Progressive Web App）のプッシュ通知機能を実装したプロジェクトです。Web Push API を使用して、ブラウザが閉じられていてもユーザーに通知を送信できる機能を提供します。

## 🚀 クイックスタート

### 1. 依存関係のインストール

```bash
npm ci
```

### 2. VAPID 鍵の生成

```bash
npx web-push generate-vapid-keys
```

### 3. 環境変数の設定

`.env.local` ファイルを作成し、生成された鍵を設定：

```env
VAPID_PUBLIC_KEY=生成された公開鍵
VAPID_PRIVATE_KEY=生成された秘密鍵
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

### 5. ブラウザでアクセス

`http://localhost:3000` にアクセスして通知機能をテストしてください。

## 📚 ドキュメント

### 🎯 クイックスタートガイド

- **[QUICKSTART.md](./QUICKSTART.md)** - 5 分で始める通知機能のセットアップガイド

### 📖 詳細ドキュメント

- **[NOTIFICATION_DOCUMENTATION.md](./NOTIFICATION_DOCUMENTATION.md)** - プッシュ通知機能の詳細な技術仕様と実装解説

## ✨ 主要機能

- 🔔 **通知許可管理** - ブラウザの通知許可状態の確認と要求
- 📱 **プッシュ通知購読** - Service Worker 登録とプッシュ通知の購読
- 📤 **通知送信** - サーバーサイドからの通知送信機能
- 🎨 **リッチ通知表示** - アイコン、画像、アクションを含む通知
- 🔄 **購読管理** - 購読状況の確認と解除機能

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 + React 19
- **言語**: TypeScript
- **プッシュ通知**: Web Push API + web-push ライブラリ
- **スタイリング**: Tailwind CSS
- **Service Worker**: カスタム実装

## 📁 プロジェクト構造

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

## 🔧 利用可能なスクリプト

```bash
npm run dev      # 開発サーバー起動（Turbopack使用）
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint実行
```

## 🐛 トラブルシューティング

よくある問題と解決方法については、[QUICKSTART.md](./QUICKSTART.md)のトラブルシューティングセクションを参照してください。

## 📖 詳細な実装解説

技術的な詳細、API 仕様、コンポーネントの実装について知りたい場合は、[NOTIFICATION_DOCUMENTATION.md](./NOTIFICATION_DOCUMENTATION.md)を参照してください。

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

---

**💡 ヒント**: 初めての方は [QUICKSTART.md](./QUICKSTART.md) から始めることをお勧めします！
