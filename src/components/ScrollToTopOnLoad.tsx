"use client";

import { useEffect } from "react";

/**
 * Memastikan halaman selalu kembali ke atas saat di-refresh.
 */
export default function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}
