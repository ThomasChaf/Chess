import React from "react";

import { ControlsProps } from "./controls.d";

export const Controls = ({ actions, analyse, onGoing }: ControlsProps) => {
  const { moveBackWard, pausePlay, moveForward } = actions;

  return (
    <div className="chess-controller">
      <i className="material-icons" onClick={moveBackWard}>
        skip_previous
      </i>
      <i className="material-icons" onClick={pausePlay}>
        {onGoing ? "pause" : "play_arrow"}
      </i>
      <i className="material-icons" onClick={moveForward}>
        skip_next
      </i>
      <i className="material-icons" onClick={analyse}>
        location_disabled
      </i>
    </div>
  );
};
