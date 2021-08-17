import React from "react";

import { XButton } from "common/button";

import { Views } from "./index";

interface InitialStateProps {
  switchVue: (vue: Views) => void;
  redirect: (path: string) => void;
}

export const NavigationPanel = (props: InitialStateProps) => (
  <div className="menu-content">
    <XButton onClick={() => props.redirect("/workout")} next>
      Workout
    </XButton>
    <br />
    <XButton onClick={() => props.switchVue(Views.LoadGame)} next>
      Chess
    </XButton>
    <br />
    <XButton onClick={() => props.redirect("/2048")} next>
      2048
    </XButton>
  </div>
);
