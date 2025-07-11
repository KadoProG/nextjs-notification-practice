self.addEventListener("push", function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || "/next.svg",
    badge: data.badge || "/next.svg",
    tag: data.tag || "default",
    data: data.data || {},
    requireInteraction: false,
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
      // 既に開いているウィンドウがあれば、それをフォーカス
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }

      // 開いているウィンドウがない場合は、新しいウィンドウを開く
      if (clients.openWindow) {
        const urlToOpen = event.notification.data?.url || "/";
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener("notificationclose", function (event) {
  console.log("通知が閉じられました:", event.notification.tag);
});
