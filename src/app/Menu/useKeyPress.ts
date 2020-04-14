import { useState, useEffect } from "react";

export const useKeypress = (targetKey: string) => {
  const [isPressed, setPressed] = useState(false);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(true);
    };
    const onKeyup = (e: KeyboardEvent) => {
      if (e.key === targetKey) setPressed(false);
    };

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);

    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
    };
  }, [targetKey]);

  return isPressed;
};

export const useMenuToggler = (): [boolean, (b: boolean) => void] => {
  const [open, setOpen] = useState(false);
  const escPressed = useKeypress("Escape");

  if (escPressed && !open) setOpen(true);

  return [open, setOpen];
};
