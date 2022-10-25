import React from "react";
import { Piece, Play } from "core/chess";

import { UiPiece } from "./uiPiece";
import { UiPlay } from "./uiPlay";

import "./uiboard.scss";

interface BoardProps {
  nextPlay?: Play;
  pieces: Piece[];
}

export const Board = ({ nextPlay, pieces }: BoardProps) => {
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
        {pieces.map((piece) => (
          <UiPiece key={piece.id} {...piece} />
        ))}
        {nextPlay && <UiPlay play={nextPlay} />}
      </div>
    </div>
  );
};
