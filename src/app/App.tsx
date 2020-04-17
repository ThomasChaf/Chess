import React, { useState, useEffect, useReducer } from "react";
import { Game } from "core";
import { UiGame } from "./Game/Game";
import { Menu } from "./Menu/Menu";
import "./App.css";

interface Datas {
  game: Game;
  interval: number;
}

const useGameManager = (): [Game, (g: Game, i: number) => void] => {
  const [datas, setDatas] = useState<Datas>({ game: new Game(), interval: 0 });
  const { game, interval } = datas;
  const update = useReducer((x) => x + 1, 0)[1];

  useEffect(() => {
    const timer = game.launch(interval, update);

    return () => clearInterval(timer);
  }, [game.id]); // eslint-disable-line

  const setGame = (game: Game, interval: number) => setDatas({ game, interval })

  return [game, setGame];
};

export const App = () => {
  const [game, setGame] = useGameManager();

  return (
    <div className="App">
      <Menu start={setGame} />
      <UiGame game={game} />
    </div>
  );
};
