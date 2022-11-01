import { useState } from "react";
import { flushSync } from "react-dom";
import { Game } from "core/chess";

import { find } from "./analyst";

export const useAnalyse = (game: Game) => {
  const [loading, setLoading] = useState<boolean>(false);

  const analyse = () => {
    flushSync(() => setLoading(true));
    const lastPlay = game.getLastPlay();
    if (lastPlay) {
      const results = find(game.board, lastPlay);

      game.setAnalyse(results);
    }

    setLoading(false);
  };

  return { analyse, loading };
};
