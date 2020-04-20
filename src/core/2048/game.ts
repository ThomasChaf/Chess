import { Position } from "core/game-d";

const VAL = [0, 1, 2, 3];

export enum Move {
  Left = 1,
  Right,
  Top,
  Bottom
}

class Piece {
  col: number;
  row: number;
  value: number = 2;
  willDisappear: boolean = false;

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

class Board {
  private pieces: Piece[] = [];

  private getEmptyCases(): Position[] {
    const res: Position[] = [];
    VAL.forEach((row) => {
      VAL.forEach((col) => {
        if (!this.getAt(row, col)) res.push([row, col]);
      });
    });

    return res;
  }

  addRandom = () => {
    const emptyCases = this.getEmptyCases();
    const rand = Math.floor(Math.random() * Math.floor(emptyCases.length));
    const [row, col] = emptyCases[rand];
    this.pieces.push(new Piece(row, col));
  };

  getAt = (row: number, col: number) => {
    return this.pieces.find((p) => p.row === row && p.col === col && !p.willDisappear);
  };
}

export class Game {
  board: Board = new Board();

  private grabNextPiece = (piece: Piece, incR: number, incC: number, next: number = 1): Piece | undefined => {
    const lookAtRow = piece.row + incR * next;
    const lookAtCol = piece.col + incC * next;
    if (lookAtRow < 0 || lookAtRow > 3 || lookAtCol < 0 || lookAtCol > 3) return;

    const nextPiece = this.board.getAt(lookAtRow, lookAtCol);

    if (!nextPiece) return this.grabNextPiece(piece, incR, incC, next + 1);

    return nextPiece;
  };

  private findPrevSpace = (piece: Piece, incR: number, incC: number, prev: number = 1): Position | undefined => {
    const lookAtRow = piece.row - incR * prev;
    const lookAtCol = piece.col - incC * prev;
    if (lookAtRow < 0 || lookAtRow > 3 || lookAtCol < 0 || lookAtCol > 3) return;

    if (!this.board.getAt(lookAtRow, lookAtCol)) {
      return this.findPrevSpace(piece, incR, incC, prev + 1) || ([lookAtRow, lookAtCol] as Position);
    }
  };

  private computePlay = (from: Position[], incR: number, incC: number) => {
    from.forEach(([row, col]) => {
      VAL.forEach((deep) => {
        const lookAtRow = row + incR * deep;
        const lookAtCol = col + incC * deep;

        const piece = this.board.getAt(lookAtRow, lookAtCol);
        if (!piece) return;

        const spacePostion = this.findPrevSpace(piece, incR, incC);
        const nextPiece = this.grabNextPiece(piece, incR, incC);

        if (spacePostion) {
          piece.move(...spacePostion);
        }

        if (nextPiece?.value === piece.value) {
          piece.willDisappear = true;
          nextPiece.merge(piece);
        }
      });
    });
  };

  private playLeft = () => {
    const from = VAL.map((x) => [x, 0] as Position);
    this.computePlay(from, 0, 1);
  };

  private playRight = () => {
    const from = VAL.map((x) => [x, 3] as Position);
    this.computePlay(from, 0, -1);
  };

  private playTop = () => {
    const from = VAL.map((y) => [0, y] as Position);
    this.computePlay(from, 1, 0);
  };

  private playBottom = () => {
    const from = VAL.map((y) => [3, y] as Position);
    this.computePlay(from, -1, 0);
  };

  public play = (move: Move) => {
    if (move === Move.Left) this.playLeft();
    if (move === Move.Right) this.playRight();
    if (move === Move.Top) this.playTop();
    if (move === Move.Bottom) this.playBottom();

    this.board.addRandom();
  };

  public print = () => {
    VAL.forEach((x) => {
      console.log(VAL.map((y) => this.board.getAt(x, y)?.value || 0).join(" | "));
    });
  };
}
