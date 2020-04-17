import React from "react";
import { Piece } from "core/index";
import { UiPiece } from "./UiPiece/UiPiece";
import "./Board.scss";

interface BoardProps {
  pieces: Piece[];
}

export const Board = (props: BoardProps) => {
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="board">
      <div className="board-content">
        {rows.map((r) => (
          <div key={`${r}`} className="board-row">
            {cols.map((c) => (
              <div key={`${r}${c}`} className="board-case" />
            ))}
          </div>
        ))}
        {props.pieces.map((piece) => (
          <UiPiece key={piece.id} {...piece} />
        ))}
      </div>
    </div>
  );
};
