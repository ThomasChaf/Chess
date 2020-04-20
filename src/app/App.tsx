import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Game } from "core/chess";
import { UiGame } from "./Chess/Game";
import { Menu } from "./Menu/Menu";
import "./App.css";
import { useGameManager } from "./Chess/useGameManager";

export interface Datas {
  game: Game;
  interval: number;
}

export const App = () => {
  const [game, setGame] = useGameManager();

  return (
    <Router>
      <div className="App">
        <Menu start={setGame} />

        <Switch>
          <Route path="/chess">
            <UiGame game={game} />
          </Route>
          <Route path="/2048">2048</Route>

          <Redirect to="/chess" />
        </Switch>
      </div>
    </Router>
  );
};
