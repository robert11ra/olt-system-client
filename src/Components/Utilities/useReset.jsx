import { useState } from "react";

export default function useReset () {
  const [key, setKey] = useState(0);

  const reset = () => {
    setKey(key + 1);
  };

  return [reset, key];
}