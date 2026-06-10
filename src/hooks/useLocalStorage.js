import { useState } from "react";

export default function useLocalStorage(
  key,
  initialValue
) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);

    return saved
      ? JSON.parse(saved)
      : initialValue;
  });

  const saveValue = (newValue) => {
    setValue(newValue);

    localStorage.setItem(
      key,
      JSON.stringify(newValue)
    );
  };

  return [value, saveValue];
}