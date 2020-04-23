import { generate } from "shortid";

export class Piece {
  public id: string = generate();
  public col: number;
  public row: number;
  public value: number = 2;
  public willDisappear: boolean = false;

  constructor(row: number, col: number) {
    this.col = col;
    this.row = row;
  }

  public move = (row: number, col: number) => {
    this.col = col;
    this.row = row;
  };

  public merge = (piece: Piece) => {
    this.value *= 2;
    this.col = piece.col;
    this.row = piece.row;
  };
}
