import React, { FC } from "react";

import { Board } from "./board";
import { Controls } from "./controls";
import { ChessProps } from "./chess";
import { useActions } from "./useActions";

import "./game.scss";

export const Chess: FC<ChessProps> = ({ game }) => {
  const actions = useActions(game);

  console.log(game);

  return (
    <div className="chess-container">
      <Board pieces={game.board.getPieces()} />
      <Controls onGoing={game.onGoing} actions={actions} />
    </div>
  );
};
