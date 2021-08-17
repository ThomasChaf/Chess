import { useState, useReducer } from "react";

import { Game, Move } from "core/2048";
import { useKeypress } from "common/hooks/useKeypress";

export const useGameManager = (): Game => {
  const [game] = useState(new Game());
  const update = useReducer((x) => x + 1, 0)[1];

  const play = (move: Move) => {
    game.play(move);
    update();
  };

  useKeypress({
    ArrowLeft: () => play(Move.Left),
    ArrowRight: () => play(Move.Right),
    ArrowUp: () => play(Move.Top),
    ArrowDown: () => play(Move.Bottom)
  });

  return game;
};
