import { useReducer } from "react";
import { Game } from "core/chess";

export function useActions(game: Game) {
  const update = useReducer((x) => x + 1, 0)[1];

  const moveForward = () => {
    game.moveForward();
    update();
  };

  const moveBackWard = () => {
    game.moveBackWard();
    update();
  };

  const pausePlay = () => {
    game.playPause();
    update();
  };

  return { moveBackWard, moveForward, pausePlay };
}
