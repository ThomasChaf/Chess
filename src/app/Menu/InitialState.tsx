import React from "react";
import { EVues } from "./Menu";

interface InitialStateProps {
  switchVue: (vue: EVues) => void;
}

export const InitalState = (props: InitialStateProps) => (
  <div className="menu-content">
    <button className="menu-option secondary" onClick={() => props.switchVue(EVues.LoadGame)}>
      Load game
    </button>
  </div>
);
