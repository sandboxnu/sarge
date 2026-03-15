'use client';

import { useEffect, useState } from "react";

export function useWindowUnfocused(): boolean {
  const [isWindowUnfocused, setIsWindowUnfocused] = useState(false);

  useEffect(() => {
    const getIsUnfocused = () => {
      return document.hidden || !document.hasFocus();
    };

    const handleFocus = () => {
      setIsWindowUnfocused(getIsUnfocused());
    };

    const handleBlur = () => {
      setIsWindowUnfocused(true);
    };

    const handleVisibilityChange = () => {
      setIsWindowUnfocused(getIsUnfocused());
    };

    setIsWindowUnfocused(getIsUnfocused());

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isWindowUnfocused;
}