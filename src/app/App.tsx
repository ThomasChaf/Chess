import React, { useState, useEffect, useReducer } from "react";
import { Game } from "core/index";
import { Board } from "./Board/Board";
import { Menu } from "./Menu/Menu";
import "./App.css";

const useGameManager = (): [Game, (g: Game) => void] => {
  const [game, setGame] = useState<Game>(new Game());
  const update = useReducer((x) => x + 1, 0)[1];

  useEffect(() => {
    const timer = game.launch(update);

    return () => clearInterval(timer);
  }, [game.id]); // eslint-disable-line

  return [game, setGame];
};

export const App = () => {
  const [game, setGame] = useGameManager();

  return (
    <div className="App">
      <Menu start={setGame} />
      <Board pieces={game.board.getPieces()} />
    </div>
  );
};
