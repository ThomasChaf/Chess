import React from "react";

interface Actions {
  moveBackWard: () => void;
  moveForward: () => void;
  pausePlay: () => void;
}

interface ControlsProps {
  actions: Actions;
  onGoing: boolean;
}

export const Controls = (props: ControlsProps) => {
  return (
    <div className="chess-controller">
      <i className="material-icons" onClick={() => props.actions.moveBackWard()}>
        skip_previous
      </i>
      <i className="material-icons" onClick={() => props.actions.pausePlay()}>
        {props.onGoing ? "pause" : "play_arrow"}
      </i>
      <i className="material-icons" onClick={() => props.actions.moveForward()}>
        skip_next
      </i>
    </div>
  );
};
