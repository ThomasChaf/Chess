import { BoardPosition } from "core/chess/chess";
import { Move, VAL } from "./2048-d";
import { Piece } from "./piece";
import { Board } from "./board";

type PlayArgs = [BoardPosition[], number, number];

export class Game {
  board: Board = new Board();

  constructor() {
    this.board.addRandom();
  }

  private grabNextPiece = (piece: Piece, incR: number, incC: number, next: number = 1): Piece | undefined => {
    const lookAtRow = piece.row + incR * next;
    const lookAtCol = piece.col + incC * next;
    if (lookAtRow < 0 || lookAtRow > 3 || lookAtCol < 0 || lookAtCol > 3) return;

    const nextPiece = this.board.getAt(lookAtRow, lookAtCol);

    if (!nextPiece) return this.grabNextPiece(piece, incR, incC, next + 1);

    return nextPiece;
  };

  private findPrevSpace = (piece: Piece, incR: number, incC: number, prev: number = 1): BoardPosition | undefined => {
    const lookAtRow = piece.row - incR * prev;
    const lookAtCol = piece.col - incC * prev;
    if (lookAtRow < 0 || lookAtRow > 3 || lookAtCol < 0 || lookAtCol > 3) return;

    if (!this.board.getAt(lookAtRow, lookAtCol)) {
      return this.findPrevSpace(piece, incR, incC, prev + 1) || ([lookAtRow, lookAtCol] as BoardPosition);
    }
  };

  private computePlay = (from: BoardPosition[], incR: number, incC: number) => {
    let hasPlay = false;
    from.forEach(([row, col]) => {
      VAL.forEach((deep) => {
        const lookAtRow = row + incR * deep;
        const lookAtCol = col + incC * deep;

        const piece = this.board.getAt(lookAtRow, lookAtCol);
        if (!piece) return;

        const spacePostion = this.findPrevSpace(piece, incR, incC);
        const nextPiece = this.grabNextPiece(piece, incR, incC);

        if (spacePostion) {
          hasPlay = true;
          piece.move(...spacePostion);
        }

        if (nextPiece?.value === piece.value) {
          hasPlay = true;
          piece.willDisappear = true;
          nextPiece.merge(piece);
        }
      });
    });
    return hasPlay;
  };

  private argsFromMove = (move: Move): PlayArgs =>
    ({
      [Move.Left]: [VAL.map((x) => [x, 0]), 0, 1] as PlayArgs,
      [Move.Right]: [VAL.map((x) => [x, 3]), 0, -1] as PlayArgs,
      [Move.Top]: [VAL.map((y) => [0, y]), 1, 0] as PlayArgs,
      [Move.Bottom]: [VAL.map((y) => [3, y]), -1, 0] as PlayArgs
    }[move]);

  public play = (move: Move) => {
    this.board.clean();

    const args = this.argsFromMove(move);

    const hasPlayed = this.computePlay(...args);

    if (hasPlayed) this.board.addRandom();
  };

  public print = () => {
    VAL.forEach((x) => {
      console.log(VAL.map((y) => this.board.getAt(x, y)?.value || 0).join(" | "));
    });
  };
}
