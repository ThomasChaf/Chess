import { useEffect } from "react";

type KeyCallbacks = {
  [key: string]: () => void;
};

export const useKeypress = (keyCallbacks: KeyCallbacks) => {
  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      const cb = keyCallbacks[e.key];

      if (cb) cb();
    };

    window.addEventListener("keydown", onKeydown);

    return () => window.removeEventListener("keydown", onKeydown);
  }, [keyCallbacks]);
};
