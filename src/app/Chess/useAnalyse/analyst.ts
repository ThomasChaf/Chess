import { Piece, PieceColor, PieceType } from "core/chess";
import { Board } from "core/chess/board";

export class Analyst {
  public isMate(board: Board, color: PieceColor): Piece | null {
    const king = board.getPieces({ type: PieceType.King, color })[0];
    const moves = board.computePossibleDestinations(king);

    return board.isPositionDefended(king.position, color) && moves.length === 0 ? king : null;
  }

  public find(board: Board) {
    [PieceColor.White, PieceColor.Black].forEach((color) => {
      const king = this.isMate(board, color);
      if (king) {
        console.log("MATE:", king);
      }
    });
  }
}
