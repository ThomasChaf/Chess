import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useSpring, animated } from "react-spring";

import { useKeypress } from "common/hooks/useKeypress";

import "./animatedLayout.scss";

export interface AnimatedLayoutRef {
  open: () => void;
  close: () => void;
}

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

export const AnimatedLayout = forwardRef((props: AnimatedLayoutProps, ref) => {
  const [isOpen, setOpen] = useState(false);

  const open = () => setOpen(true);

  const close = () => {
    if (!open) return;

    setOpen(false);
  };

  useKeypress({ Escape: close });
  useImperativeHandle(ref, () => ({ open, close }));

  const animatedStyle = useSpring(isOpen ? { width: "100vw", height: "100vh" } : { width: "0vw", height: "0vh" });

  return (
    <animated.div className="menu-container" style={animatedStyle}>
      <span onClick={close} className="menu-close material-icons">
        close
      </span>
      {props.children}
    </animated.div>
  );
});
