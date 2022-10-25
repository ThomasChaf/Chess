import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Chess } from "./chess";
import { Ui2048 } from "./2048/2048";
import { Menu } from "./menu";
import { Workout } from "./workout/Workout";

import "./main.css";

export const App = () => {
  return (
    <Router>
      <div className="App">
        <Menu />

        <Switch>
          <Route path="/chess" component={Chess} />
          <Route path="/2048" component={Ui2048} />
          <Route path="/workout" component={Workout} />
        </Switch>
      </div>
    </Router>
  );
};
