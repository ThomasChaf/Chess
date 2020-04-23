import React from "react";
import { Piece } from "core/chess";
import { UiPiece } from "./UiPiece/UiPiece";
import "./Board.scss";

interface BoardProps {
  pieces: Piece[];
}

export const Board = (props: BoardProps) => {
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="chess-board">
      <div className="chess-board-content">
        {rows.map((r) => (
          <div key={`${r}`} className="chess-board-row">
            {cols.map((c) => (
              <div key={`${r}${c}`} className="chess-board-case" />
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
