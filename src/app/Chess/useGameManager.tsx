import { useState, useEffect } from "react";
import { Game } from "core/chess";

interface Datas {
  game: Game;
  interval: number;
}

export const useGameManager = (): [Game, (g: Game, i: number) => void] => {
  const [datas, setDatas] = useState<Datas>({ game: new Game(), interval: 0 });
  const { game, interval } = datas;

  useEffect(() => {
    const timer = game.launch(interval);
    return () => clearInterval(timer);
  }, [game.id]); // eslint-disable-line

  const setGame = (game: Game, interval: number) => setDatas({ game, interval });

  return [game, setGame];
};
