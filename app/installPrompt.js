"use client";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e); // Save event for later
      setShowButton(true);  // Show install button
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); // Show native install prompt

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <div style={{ padding: 10, background: "#2563eb", color: "white" }}>
      <p>Install our Attendance App for quick access.</p>
      <button
        onClick={handleInstallClick}
        style={{
          padding: "6px 12px",
          background: "white",
          color: "#2563eb",
          border: "none",
          cursor: "pointer",
        }}
      >
        Install App
      </button>
    </div>
  );
}
