import { Play } from "core/chess";
import { Board } from "core/chess/board";

export enum SuggestionType {
  Mate,
  Move
}

export interface Suggestion {
  plays?: Play[];
  type: SuggestionType;
}

export interface Situation {
  board: Board;
  play: Play;
}

export interface SituationAnalyse {
  kingAttacked: boolean;
}
