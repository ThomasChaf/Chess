import cn from "classnames";

import { PieceType, PieceColor } from "core/chess";

import "./uiPiece.scss";

interface PieceProps {
  row: number;
  col: number;
  color: PieceColor;
  type: PieceType;
}

export const UiPiece = (props: PieceProps) => {
  const x = `x-${props.col - 1}`;
  const y = `y-${8 - props.row}`;

  return <div className={cn("chess-piece", props.color, props.type, x, y)} />;
};
