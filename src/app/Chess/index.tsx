import React from "react";

import { Board } from "./board";
import { Controls } from "./controls";
import { ChessProps } from "./chess";
import { useActions } from "./useActions";
import { useAnalyse } from "./useAnalyse";

import "./game.scss";

export const Chess = ({ game }: ChessProps) => {
  const actions = useActions(game);
  const { analyse, loading } = useAnalyse(game);

  const nextPlay = !loading ? game.getPlay() : undefined;

  return (
    <div className="chess-container">
      <Board nextPlay={nextPlay} pieces={game.board.getPieces()} />
      <Controls onGoing={game.onGoing()} actions={actions} analyse={analyse} />
    </div>
  );
};
