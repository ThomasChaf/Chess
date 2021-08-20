import { Piece, PieceColor, PieceType, Play, Suggestion, SuggestionType } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";

export class Analyst {
  private isMate(board: Board, color: PieceColor): Piece | null {
    const opponentKing = board.getPieces({ type: PieceType.King, color })[0];
    const moves = board.computePossibleDestinations(opponentKing);

    return board.isPositionDefended(opponentKing.position, color) && moves.length === 0 ? opponentKing : null;
  }

  private findMate(board: Board, color: PieceColor): Play | null {
    const pieces = board.getPieces({ color });

    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      const moves = board.computePossibleDestinations(piece);
      for (let move of moves) {
        const nextBoard = Board.copy(board);
        const play = nextBoard.applyMove({ from: piece.position, to: move });
        if (this.isMate(nextBoard, opponentColor(color))) {
          return play;
        }
      }
    }

    return null;
  }

  public find(board: Board, lastPlay?: Play): Suggestion | null {
    console.log("lastPlay", lastPlay);

    const color = lastPlay?.piece?.color || PieceColor.White;
    const king = this.isMate(board, color);
    if (king) {
      return { matePiece: king, type: SuggestionType.Mate };
    }

    const play = this.findMate(board, color);
    if (play) {
      return { play, type: SuggestionType.Move };
    }

    return null;
  }
}
