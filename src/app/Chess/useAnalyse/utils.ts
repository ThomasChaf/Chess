import { PieceColor, PieceType, Play } from "core/chess";
import { Board } from "core/chess/board";

export const displayPlay = ({ move, piece }: Play): string => {
  return `${JSON.stringify(move)} ${piece.type} ${piece.color}`;
};

export const displaySuggestion = (plays: Play[] | null): string => {
  if (!plays) return "null";

  return `${plays.map(displayPlay).join("\n")}`;
};

export const getKing = (board: Board, color: PieceColor) => board.getPieces({ type: PieceType.King, color })[0];
