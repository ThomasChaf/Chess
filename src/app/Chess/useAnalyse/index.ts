import { useState } from "react";
import { Game } from "core/chess";

import { Analyst } from "./analyst";

export const useAnalyse = (game: Game) => {
  const [loading, setLoading] = useState<boolean>(false);

  const analyse = () => {
    setLoading(true);

    const lastPlay = game.getLastPlay();
    if (lastPlay) {
      const result = Analyst.find(game.board, lastPlay);
      console.log("============= FINAL RESULT: =============");
      result?.display();
      console.log(result);
      console.log("=========================================");
    }

    setLoading(false);
  };

  return { analyse, loading };
};
