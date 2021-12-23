import { Play } from ".";
import { BoardPosition, PieceType, Move, PieceColor } from "./chess-d";
import { Piece } from "./piece";

export const opponentColor = (color: PieceColor) => (color === PieceColor.White ? PieceColor.Black : PieceColor.White);

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

export const parseType = (type: string): PieceType => {
  switch (type) {
    case "Q":
      return PieceType.Queen;
    case "K":
      return PieceType.King;
    case "N":
      return PieceType.Knight;
    case "R":
      return PieceType.Tower;
    case "B":
      return PieceType.Bishop;
    default:
      throw new Error("Invalid piece type");
  }
};

export const isSameBox = ([r1, c1]: BoardPosition, [r2, c2]: BoardPosition): boolean => r1 === r2 && c1 === c2;

export const isPawn = (piece: Piece | undefined): piece is Piece => !!piece && piece.type === PieceType.Pawn;

export const reverseMove = ({ from, to }: Move): Move => ({ from: to, to: from });

export const comparePlay = (play: Play, otherPlay: Play): boolean => {
  return (
    play.move.from[0] === otherPlay.move.from[0] &&
    play.move.from[1] === otherPlay.move.from[1] &&
    play.move.to[0] === otherPlay.move.to[0] &&
    play.move.to[1] === otherPlay.move.to[1] &&
    play.piece.type === otherPlay.piece.type &&
    play.piece.color === otherPlay.piece.color &&
    play.piece.row === otherPlay.piece.row &&
    play.piece.col === otherPlay.piece.col
  );
};
