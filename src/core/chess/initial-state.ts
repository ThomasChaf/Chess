import { PieceType, PieceColor } from "./chess";

interface IPiece {
  row: number;
  col: number;
  type: PieceType;
  color: PieceColor;
}

export const PIECES: IPiece[] = [
  // Black pieces
  {
    row: 8,
    col: 1,
    type: PieceType.Tower,
    color: PieceColor.Black
  },
  {
    row: 8,
    col: 2,
    type: PieceType.Knight,
    color: PieceColor.Black
  },
  {
    row: 8,
    col: 3,
    type: PieceType.Bishop,
    color: PieceColor.Black
  },
  {
    row: 8,
    col: 4,
    type: PieceType.Queen,
    color: PieceColor.Black
  },
  {
    row: 8,
    col: 5,
    type: PieceType.King,
    color: PieceColor.Black
  },
  {
    row: 8,
    col: 6,
    type: PieceType.Bishop,
    color: PieceColor.Black
  },
  {
    row: 8,
    col: 7,
    type: PieceType.Knight,
    color: PieceColor.Black
  },
  {
    row: 8,
    col: 8,
    type: PieceType.Tower,
    color: PieceColor.Black
  },
  // Black pawns
  {
    row: 7,
    col: 1,
    type: PieceType.Pawn,
    color: PieceColor.Black
  },
  {
    row: 7,
    col: 2,
    type: PieceType.Pawn,
    color: PieceColor.Black
  },
  {
    row: 7,
    col: 3,
    type: PieceType.Pawn,
    color: PieceColor.Black
  },
  {
    row: 7,
    col: 4,
    type: PieceType.Pawn,
    color: PieceColor.Black
  },
  {
    row: 7,
    col: 5,
    type: PieceType.Pawn,
    color: PieceColor.Black
  },
  {
    row: 7,
    col: 6,
    type: PieceType.Pawn,
    color: PieceColor.Black
  },
  {
    row: 7,
    col: 7,
    type: PieceType.Pawn,
    color: PieceColor.Black
  },
  {
    row: 7,
    col: 8,
    type: PieceType.Pawn,
    color: PieceColor.Black
  },
  // White pieces
  {
    row: 1,
    col: 1,
    type: PieceType.Tower,
    color: PieceColor.White
  },
  {
    row: 1,
    col: 2,
    type: PieceType.Knight,
    color: PieceColor.White
  },
  {
    row: 1,
    col: 3,
    type: PieceType.Bishop,
    color: PieceColor.White
  },
  {
    row: 1,
    col: 4,
    type: PieceType.Queen,
    color: PieceColor.White
  },
  {
    row: 1,
    col: 5,
    type: PieceType.King,
    color: PieceColor.White
  },
  {
    row: 1,
    col: 6,
    type: PieceType.Bishop,
    color: PieceColor.White
  },
  {
    row: 1,
    col: 7,
    type: PieceType.Knight,
    color: PieceColor.White
  },
  {
    row: 1,
    col: 8,
    type: PieceType.Tower,
    color: PieceColor.White
  },
  // White pawns
  {
    row: 2,
    col: 1,
    type: PieceType.Pawn,
    color: PieceColor.White
  },
  {
    row: 2,
    col: 2,
    type: PieceType.Pawn,
    color: PieceColor.White
  },
  {
    row: 2,
    col: 3,
    type: PieceType.Pawn,
    color: PieceColor.White
  },
  {
    row: 2,
    col: 4,
    type: PieceType.Pawn,
    color: PieceColor.White
  },
  {
    row: 2,
    col: 5,
    type: PieceType.Pawn,
    color: PieceColor.White
  },
  {
    row: 2,
    col: 6,
    type: PieceType.Pawn,
    color: PieceColor.White
  },
  {
    row: 2,
    col: 7,
    type: PieceType.Pawn,
    color: PieceColor.White
  },
  {
    row: 2,
    col: 8,
    type: PieceType.Pawn,
    color: PieceColor.White
  }
];
