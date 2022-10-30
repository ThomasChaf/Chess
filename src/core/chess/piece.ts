import { generate } from "shortid";
import { PieceColor, PieceType, BoardPosition } from "./chess";

export class Piece {
  public id: string = generate();
  public type: PieceType;
  public color: PieceColor;
  public row: number;
  public col: number;

  static copy(piece: Piece) {
    return new Piece(piece.type, piece.color, piece.row, piece.col);
  }

  constructor(type: PieceType, color: PieceColor, row: number, col: number) {
    this.type = type;
    this.color = color;
    this.row = row;
    this.col = col;
  }

  get position(): BoardPosition {
    return [this.col, this.row] as BoardPosition;
  }

  move(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
}
