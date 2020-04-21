import React from "react";
import { UiPiece } from "./UiPiece/UiPiece";
import "./2048.scss";
import { useGameManager } from "./useGameManager";

export const Ui2048 = () => {
  const cases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const game = useGameManager();

  return (
    <div className="game-container">
      <div className="board">
        <div className="dk48-board-box">
          <div className="dk48-board-content">
            {cases.map((r) => (
              <div key={r} className="board-big-case" />
            ))}

            {game.board.getPieces().map((piece) => {
              return <UiPiece key={piece.id} {...piece} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
