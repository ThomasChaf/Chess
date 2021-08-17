export interface Actions {
  moveBackWard: () => void;
  moveForward: () => void;
  pausePlay: () => void;
}
export interface ControlsProps {
  actions: Actions;
  analyse: () => void;
  onGoing: boolean;
}
