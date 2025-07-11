import { useEffect, useState } from "react";

export default function useNotificationPermission() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    const currentPermission = Notification.permission;
    setPermission(currentPermission);
  }, []);

  return { permission };
}
