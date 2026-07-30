"use client";

import { useEffect, useState } from "react";
import belmontLogo from "@/assets/belmont-logo.png";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2000);
    const hideTimer = setTimeout(() => setVisible(false), 2600);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes forceFadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
        .splash-force-fade {
          animation: forceFadeOut 0.5s ease-in-out 2.5s forwards;
        }
      `}</style>
      <div
        className={`fixed inset-0 z-[100] bg-hotel-black flex items-center justify-center transition-opacity duration-500 pointer-events-none splash-force-fade ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <img src={belmontLogo.src} alt="Belmont Hotel" className="w-40 md:w-56 h-auto" />
      </div>
    </div>
    </>
  );
}
