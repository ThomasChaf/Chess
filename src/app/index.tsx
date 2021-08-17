import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useGameManager } from "./chess/useGameManager";
import { Chess } from "./chess";
import { Ui2048 } from "./2048/2048";
import { Menu } from "./menu";
import { Workout } from "./workout/Workout";

import "./app.css";

export const App = () => {
  const [game, setGame] = useGameManager();

  return (
    <Router>
      <div className="App">
        <Menu start={setGame} />

        <Switch>
          <Route path="/chess">
            <Chess game={game} />
          </Route>

          <Route path="/2048" component={Ui2048} />

          <Route path="/workout" component={Workout} />
        </Switch>
      </div>
    </Router>
  );
};
