import { Game } from "core/chess";

import { Analyst } from "./analist";

export const useAnalyse = (game: Game) => {
  const analyse = () => {
    const analyst = new Analyst();

    const moves = analyst.find(game);
    console.log(moves);
  };

  return { analyse };
};
