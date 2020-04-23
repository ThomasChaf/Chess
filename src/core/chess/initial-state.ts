import { EPieceType, EPieceColor } from "./chess-d";

interface IPiece {
  row: number;
  col: number;
  type: EPieceType;
  color: EPieceColor;
}

export const PIECES: IPiece[] = [
  // Black pieces
  {
    row: 8,
    col: 1,
    type: EPieceType.Tower,
    color: EPieceColor.Black
  },
  {
    row: 8,
    col: 2,
    type: EPieceType.Knight,
    color: EPieceColor.Black
  },
  {
    row: 8,
    col: 3,
    type: EPieceType.Bishop,
    color: EPieceColor.Black
  },
  {
    row: 8,
    col: 4,
    type: EPieceType.Queen,
    color: EPieceColor.Black
  },
  {
    row: 8,
    col: 5,
    type: EPieceType.King,
    color: EPieceColor.Black
  },
  {
    row: 8,
    col: 6,
    type: EPieceType.Bishop,
    color: EPieceColor.Black
  },
  {
    row: 8,
    col: 7,
    type: EPieceType.Knight,
    color: EPieceColor.Black
  },
  {
    row: 8,
    col: 8,
    type: EPieceType.Tower,
    color: EPieceColor.Black
  },
  // Black pawns
  {
    row: 7,
    col: 1,
    type: EPieceType.Pawn,
    color: EPieceColor.Black
  },
  {
    row: 7,
    col: 2,
    type: EPieceType.Pawn,
    color: EPieceColor.Black
  },
  {
    row: 7,
    col: 3,
    type: EPieceType.Pawn,
    color: EPieceColor.Black
  },
  {
    row: 7,
    col: 4,
    type: EPieceType.Pawn,
    color: EPieceColor.Black
  },
  {
    row: 7,
    col: 5,
    type: EPieceType.Pawn,
    color: EPieceColor.Black
  },
  {
    row: 7,
    col: 6,
    type: EPieceType.Pawn,
    color: EPieceColor.Black
  },
  {
    row: 7,
    col: 7,
    type: EPieceType.Pawn,
    color: EPieceColor.Black
  },
  {
    row: 7,
    col: 8,
    type: EPieceType.Pawn,
    color: EPieceColor.Black
  },
  // White pieces
  {
    row: 1,
    col: 1,
    type: EPieceType.Tower,
    color: EPieceColor.White
  },
  {
    row: 1,
    col: 2,
    type: EPieceType.Knight,
    color: EPieceColor.White
  },
  {
    row: 1,
    col: 3,
    type: EPieceType.Bishop,
    color: EPieceColor.White
  },
  {
    row: 1,
    col: 4,
    type: EPieceType.Queen,
    color: EPieceColor.White
  },
  {
    row: 1,
    col: 5,
    type: EPieceType.King,
    color: EPieceColor.White
  },
  {
    row: 1,
    col: 6,
    type: EPieceType.Bishop,
    color: EPieceColor.White
  },
  {
    row: 1,
    col: 7,
    type: EPieceType.Knight,
    color: EPieceColor.White
  },
  {
    row: 1,
    col: 8,
    type: EPieceType.Tower,
    color: EPieceColor.White
  },
  // White pawns
  {
    row: 2,
    col: 1,
    type: EPieceType.Pawn,
    color: EPieceColor.White
  },
  {
    row: 2,
    col: 2,
    type: EPieceType.Pawn,
    color: EPieceColor.White
  },
  {
    row: 2,
    col: 3,
    type: EPieceType.Pawn,
    color: EPieceColor.White
  },
  {
    row: 2,
    col: 4,
    type: EPieceType.Pawn,
    color: EPieceColor.White
  },
  {
    row: 2,
    col: 5,
    type: EPieceType.Pawn,
    color: EPieceColor.White
  },
  {
    row: 2,
    col: 6,
    type: EPieceType.Pawn,
    color: EPieceColor.White
  },
  {
    row: 2,
    col: 7,
    type: EPieceType.Pawn,
    color: EPieceColor.White
  },
  {
    row: 2,
    col: 8,
    type: EPieceType.Pawn,
    color: EPieceColor.White
  }
];
