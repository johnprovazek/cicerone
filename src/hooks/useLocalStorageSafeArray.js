import { useLocalStorage } from "@uidotdev/usehooks";

export function useLocalStorageSafeArray(key, defaultValue, isSafe) {
  const [value, setValue] = useLocalStorage(key, defaultValue);

  const safeValue = Array.isArray(value) && value.length > 0 ? value : defaultValue;

  return [isSafe ? safeValue : value, setValue];
}
