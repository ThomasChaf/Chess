import { Game } from "core/chess";

import { Analyst } from "./analyst";

export const useAnalyse = (game: Game) => {
  const analyse = () => {
    const analyst = new Analyst();

    console.log(game);

    const result = analyst.find(game.board);
    console.log(result);
  };

  return { analyse };
};
