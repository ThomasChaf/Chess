import React, { useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring";
import cn from "classnames";
import "./UiPiece.scss";

interface PieceProps {
  row: number;
  col: number;
  value: number;
}

export const UiPiece = (props: PieceProps) => {
  const x = `x-${props.col}`;
  const y = `y-${props.row}`;

  const ref = useRef(false);
  const [springs, set] = useSpring(() => ({
    from: { opacity: 0, x: 0 },
    opacity: 1
  }));
  useEffect(() => {
    set({ x: ref.current ? 1 : 0, delay: 200 });
    ref.current = !ref.current;
  }, [props.value, set]);

  const animatedStyle = {
    opacity: springs.opacity
      .interpolate({
        range: [0, 0.5, 1],
        output: [0, 0, 1]
      })
      .interpolate((o: number) => o),
    transform: springs.x
      .interpolate({
        range: [0, 0.9, 1],
        output: [1, 1.1, 1]
      })
      .interpolate((s: number) => `scale(${s})`)
  };
  return (
    <div className={cn("big-piece", `val-${props.value}`, x, y)}>
      <animated.div style={animatedStyle} className="big-piece-content">
        {props.value}
      </animated.div>
    </div>
  );
};
