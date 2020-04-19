import React from "react";
import { XButton } from "common/Button/Button";
import { EVues } from "./Menu";

interface InitialStateProps {
  switchVue: (vue: EVues) => void;
}

export const InitalState = (props: InitialStateProps) => (
  <div className="menu-content">
    <XButton onClick={() => props.switchVue(EVues.LoadGame)} next>
      Chess viewer
    </XButton>
  </div>
);
