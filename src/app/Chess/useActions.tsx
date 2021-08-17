import { useEffect, useReducer } from "react";
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
    game.playPause(update);
  };

  useEffect(() => {
    if (!game.autoplay) return;

    const timer = game.launch(update);
    return () => clearInterval(timer);
  }, [game.id]); // eslint-disable-line

  return { moveBackWard, moveForward, pausePlay };
}
