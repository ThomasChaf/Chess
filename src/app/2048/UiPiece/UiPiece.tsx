import React from "react";
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

  return (
    <div className={cn("big-piece", `val-${props.value}`, x, y)}>
      <div className="big-piece-content">{props.value}</div>
    </div>
  );
};
