import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useGameManager } from "./Chess/useGameManager";
import { UiGame } from "./Chess/Game";
import { Ui2048 } from "./2048/2048";
import { Menu } from "./Menu/Menu";
import { Workout } from "./Workout/Workout";
import "./App.css";

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

          <Route path="/2048" component={Ui2048} />

          <Route path="/workout" component={Workout} />

          <Redirect to="/workout" />
        </Switch>
      </div>
    </Router>
  );
};
