import { useState } from "react";
import { Game } from "core/chess";

import { find } from "./analyst";
import { flushSync } from "react-dom";

export const useAnalyse = (game: Game) => {
  const [loading, setLoading] = useState<boolean>(false);

  const analyse = () => {
    flushSync(() => setLoading(true));

    const lastPlay = game.getLastPlay();
    if (lastPlay) {
      const results = find(game.board, lastPlay);

      console.log(results);

      game.setAnalyse(results);
    }

    setLoading(false);
  };

  console.log("LOADING:", loading);

  return { analyse, loading };
};
