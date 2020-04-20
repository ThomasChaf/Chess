import React from "react";
import { XButton } from "common/Button/Button";
import { EVues } from "./Menu";

interface InitialStateProps {
  switchVue: (vue: EVues) => void;
  redirect: (path: string) => void;
}

export const NavigationPanel = (props: InitialStateProps) => (
  <div className="menu-content">
    <XButton onClick={() => props.switchVue(EVues.LoadGame)} next>
      Chess viewer
    </XButton>
    <br />
    <XButton onClick={() => props.redirect("/2048")} next>
      2048
    </XButton>
  </div>
);
