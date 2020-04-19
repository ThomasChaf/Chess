import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useSpring, animated } from "react-spring";
import { useKeypress } from "./useKeyPress";
import "./AnimatedLayout.scss";

export interface AnimatedLayoutRef {
  open: () => void;
  close: () => void;
}

interface AnimatedLayoutProps {
  onOpen?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
}

export const AnimatedLayout = forwardRef((props: AnimatedLayoutProps, ref) => {
  const [isOpen, setOpen] = useState(false);
  const escPressed = useKeypress("Escape");

  const open = () => {
    setOpen(true);
    setTimeout(() => props.onOpen && props.onOpen(), 1000);
  };
  const close = () => {
    setOpen(false);
    setTimeout(() => props.onClose && props.onClose(), 1000);
  };

  useImperativeHandle(ref, () => ({ open, close }));

  if (escPressed && isOpen) close();

  const animatedStyle = useSpring(isOpen ? { width: "100vw", height: "100vh" } : { width: "0vw", height: "0vh" });

  return (
    <>
      <span onClick={open} className="menu-icon material-icons">
        menu
      </span>

      <animated.div className="menu-container" style={animatedStyle}>
        <span onClick={close} className="menu-close material-icons">
          close
        </span>
        {props.children}
      </animated.div>
    </>
  );
});
