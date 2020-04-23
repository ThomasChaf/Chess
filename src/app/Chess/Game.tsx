import React, { useReducer } from "react";
import { Game } from "core/chess";
import { Board } from "./Board/Board";
import { Controls } from "./Controls";
import "./Game.scss";

interface UiGameProps {
  game: Game;
}
export const UiGame = (props: UiGameProps) => {
  const update = useReducer((x) => x + 1, 0)[1];

  const moveForward = () => props.game.moveForward(update);
  const moveBackWard = () => props.game.moveBackWard(update);
  const pausePlay = () => props.game.playPause(update);

  const actions = { moveBackWard, moveForward, pausePlay };

  return (
    <div className="chess-container">
      <Board pieces={props.game.board.getPieces()} />
      <Controls onGoing={props.game.onGoing} actions={actions} />
    </div>
  );
};
