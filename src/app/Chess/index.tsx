import React, { FC } from "react";

import { Board } from "./board";
import { Controls } from "./controls";
import { ChessProps } from "./chess";
import { useActions } from "./useActions";

import "./game.scss";
import { useAnalyse } from "./useAnalyse";

export const Chess: FC<ChessProps> = ({ game }) => {
  const actions = useActions(game);
  const { analyse } = useAnalyse(game);

  return (
    <div className="chess-container">
      <Board pieces={game.board.getPieces()} />
      <Controls onGoing={game.onGoing()} actions={actions} analyse={analyse} />
    </div>
  );
};
