import React from "react";
import { Creator } from "./Creator/Creator";
import { MemoryRouter as Router, Switch, Route, Link } from "react-router-dom";

export const Workout = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create">
          <Creator />
        </Route>
        <Route>
          <Link to="/create">Train</Link>
        </Route>
      </Switch>
    </Router>
  );
};
