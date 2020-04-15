import { Position, EPieceType } from "./game-d";
import { Piece } from "./piece";

export const parseCol = (col: string): number => {
  switch (col.toLowerCase()) {
    case "a":
      return 1;
    case "b":
      return 2;
    case "c":
      return 3;
    case "d":
      return 4;
    case "e":
      return 5;
    case "f":
      return 6;
    case "g":
      return 7;
    case "h":
      return 8;
    default:
      throw new Error("Invalid column");
  }
};

export const parseRow = (row: string): number => parseInt(row);

export const parseType = (type: string): EPieceType => {
  switch (type) {
    case "Q":
      return EPieceType.Queen;
    case "K":
      return EPieceType.King;
    case "N":
      return EPieceType.Knight;
    case "R":
      return EPieceType.Tower;
    case "B":
      return EPieceType.Bishop;
    default:
      throw new Error("Invalid piece type");
  }
};

export const isSameCase = ([r1, c1]: Position, [r2, c2]: Position): boolean => r1 === r2 && c1 === c2;

export const isPawn = (piece: Piece | undefined): piece is Piece => !!piece && piece.type === EPieceType.Pawn;
