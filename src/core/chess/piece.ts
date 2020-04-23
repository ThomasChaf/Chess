import { generate } from "shortid";
import { EPieceColor, EPieceType, Position } from "./chess-d";

export class Piece {
  public id: string = generate();
  public type: EPieceType;
  public color: EPieceColor;
  public row: number;
  public col: number;

  constructor(type: EPieceType, color: EPieceColor, row: number, col: number) {
    this.type = type;
    this.color = color;
    this.row = row;
    this.col = col;
  }

  get position(): Position {
    return [this.row, this.col] as Position;
  }

  move(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
}
