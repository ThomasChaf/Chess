import { Game } from "core/chess";

export interface LoadGameStateProps {
  start: (game: Game, interval: number, step: number) => void;
}
