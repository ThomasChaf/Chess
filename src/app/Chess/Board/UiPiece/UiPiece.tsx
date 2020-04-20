import React from "react";
import cn from "classnames";
import { EPieceType, EPieceColor } from "core/chess";
import "./UiPiece.scss";

interface PieceProps {
  row: number;
  col: number;
  color: EPieceColor;
  type: EPieceType;
}

export const UiPiece = (props: PieceProps) => {
  const x = `x-${props.col - 1}`;
  const y = `y-${8 - props.row}`;

  return <div className={cn("piece", props.color, props.type, x, y)} />;
};
