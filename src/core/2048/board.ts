import { BoardPosition } from "core/chess/chess-d";
import { Piece } from "./piece";
import { VAL } from "./2048-d";

export class Board {
  private pieces: Piece[] = [];

  public getPieces = (): Piece[] => this.pieces;

  public clean = () => {
    this.pieces = this.pieces.filter((p) => !p.willDisappear);
  };

  private getEmptyCases(): BoardPosition[] {
    const res: BoardPosition[] = [];

    VAL.forEach((row) => {
      VAL.forEach((col) => {
        if (!this.getAt(row, col)) res.push([row, col]);
      });
    });
    return res;
  }

  public addRandom = () => {
    const emptyCases = this.getEmptyCases();
    const rand = Math.floor(Math.random() * Math.floor(emptyCases.length));
    const [row, col] = emptyCases[rand];

    this.pieces.push(new Piece(row, col));
  };

  public getAt = (row: number, col: number) => {
    return this.pieces.find((p) => p.row === row && p.col === col && !p.willDisappear);
  };
}
