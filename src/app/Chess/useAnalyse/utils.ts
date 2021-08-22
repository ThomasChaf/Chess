import { PieceColor, PieceType } from "core/chess";
import { Board } from "core/chess/board";
import { Suggestion } from "./analyst.types";

export const displaySuggestion = (suggestion: Suggestion | null): string => {
  if (!suggestion) return "null";

  const { plays } = suggestion;

  if (plays) {
    return `${plays.map(({ move, piece }) => `${JSON.stringify(move)} ${piece.type} ${piece.color}`).join("\n")}`;
  }

  return JSON.stringify(suggestion);
};

export const getKing = (board: Board, color: PieceColor) => board.getPieces({ type: PieceType.King, color })[0];
