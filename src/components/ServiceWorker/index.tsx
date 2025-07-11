"use client";
import { useEffect } from "react";

export default function ServiceWorkerContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("Service Worker registered", registration);
      });
    }
  }, []);
  return <div>{children}</div>;
}
