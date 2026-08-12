import { useState, useEffect } from "react";

const QUERY = "(pointer: coarse) and (hover: none)";

export function useIsMobileDevice() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(QUERY).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const updateMatch = (event) => {
      setIsMobile(event.matches);
    };

    mediaQueryList.addEventListener("change", updateMatch);
    return () => mediaQueryList.removeEventListener("change", updateMatch);
  }, []);

  return isMobile;
}
