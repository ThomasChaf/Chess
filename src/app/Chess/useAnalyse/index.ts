import { useState } from "react";
import { Game } from "core/chess";

import { Analyst } from "./analyst";
import { displaySuggestion } from "./utils";

export const useAnalyse = (game: Game) => {
  const [loading, setLoading] = useState<boolean>(false);

  const analyse = () => {
    setLoading(true);

    const analyst = new Analyst();
    const result = analyst.find(game.board, game.getPlay());
    console.log(displaySuggestion(result));

    setLoading(false);
  };

  return { analyse, loading };
};
