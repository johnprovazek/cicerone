import { useState, useEffect, useRef } from "react";

export function useKeyPress(targetCode, callback = null, preventDefault = false) {
  const [isPressed, setIsPressed] = useState(false);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === targetCode) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (!event.repeat) {
          setIsPressed(true);
          callbackRef.current?.(event);
        }
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === targetCode) {
        if (preventDefault) {
          event.preventDefault();
        }
        setIsPressed(false);
      }
    };

    const handleBlur = () => {
      setIsPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [targetCode, preventDefault]);

  return isPressed;
}
