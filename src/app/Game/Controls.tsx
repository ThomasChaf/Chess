import React from "react";

interface Actions {
  moveBackWard: () => void;
  moveForward: () => void;
  pausePlay: () => void;
}

interface ControlsProps {
  actions: Actions;
}

export const Controls = (props: ControlsProps) => {
  return (
    <div className="game-controller">
      <i className="material-icons" onClick={() => props.actions.moveBackWard()}>
        skip_previous
      </i>
      <i className="material-icons" onClick={() => props.actions.pausePlay()}>
        play_arrow
      </i>
      <i className="material-icons" onClick={() => props.actions.moveForward()}>
        skip_next
      </i>
    </div>
  );
};
