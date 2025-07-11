self.addEventListener("push", function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || "/next.svg",
    badge: data.badge || "/next.svg",
    tag: data.tag || "default",
    data: data.data || {},
    requireInteraction: true, // ユーザーが明示的に閉じるまで表示
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
    // 通知のスタイリングを改善
    image: data.image,
    timestamp: Date.now(),
    // 通知の優先度を設定
    priority: "high",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  // 通知をクリックした時の処理
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function (clientList) {
      const notificationData = event.notification.data || {};
      const urlToOpen = notificationData.url || "/";

      console.log("通知クリック時のデータ:", notificationData);

      // カスタムアクションタイプに基づく処理
      if (notificationData.actionType === "test-notification") {
        // テスト通知用の特別な処理
        console.log("テスト通知がクリックされました");

        // 既存ウィンドウをフォーカス
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes("/notification-test") && "focus" in client) {
            return client.focus();
          }
        }

        // 通知テストページを開く
        if (clients.openWindow) {
          return clients.openWindow("/notification-test");
        }
      }

      // 通常の処理
      // 既に開いているウィンドウがあれば、それをフォーカス
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }

      // 開いているウィンドウがない場合は、新しいウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener("notificationclose", function (event) {
  console.log("通知が閉じられました:", event.notification.tag);
});

// フォアグラウンドでの通知表示を改善
self.addEventListener("push", function (event) {
  // フォアグラウンドでも通知を表示
  if (event.data) {
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
  }
});
