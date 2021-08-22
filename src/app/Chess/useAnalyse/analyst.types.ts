import { Piece, Play } from "core/chess";
import { Board } from "core/chess/board";

export enum SuggestionType {
  Mate,
  Move
}

export interface Suggestion {
  plays?: Play[];
  matePiece?: Piece;
  type: SuggestionType;
}

export interface Situation {
  board: Board;
  play: Play;
}
