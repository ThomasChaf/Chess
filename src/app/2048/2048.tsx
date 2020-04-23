import React from "react";
import { UiPiece } from "./UiPiece/UiPiece";
import { useGameManager } from "./useGameManager";
import "./2048.scss";

export const Ui2048 = () => {
  const cases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const game = useGameManager();

  return (
    <div className="dk48-container">
      <div className="dk48-board">
        <div className="dk48-board-box">
          <div className="dk48-board-content">
            {cases.map((r) => (
              <div key={r} className="dk48-case" />
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
