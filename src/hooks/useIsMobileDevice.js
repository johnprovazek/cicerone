import { useState, useEffect } from "react";

export function useIsMobileDevice() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = "(pointer: coarse) and (hover: none)";
    const mediaQueryList = window.matchMedia(query);

    const updateMatch = () => setIsMobile(mediaQueryList.matches);
    updateMatch();

    mediaQueryList.addEventListener("change", updateMatch);
    return () => mediaQueryList.removeEventListener("change", updateMatch);
  }, []);

  return isMobile;
}
