import { Piece, PieceColor, PieceType, Play, Position } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Situation, Suggestion, SuggestionType } from "./analyst.types";

export class Analyst {
  private isMate(board: Board, color: PieceColor): Piece | null {
    const opponentKing = board.getPieces({ type: PieceType.King, color })[0];
    const moves = board.computePossibleDestinations(opponentKing);

    return board.isPositionDefended(opponentKing.position, color) && moves.length === 0 ? opponentKing : null;
  }

  private findDefensivePlay(plays: Situation[]): Situation {
    const validPlays = plays.filter(({ board }) => {
      return true;
    });

    return validPlays[0];
  }

  private findMateFromSituation(situations: Situation[], color: PieceColor) {
    for (let situation of situations) {
      const { board, play } = situation;

      if (this.isMate(board, opponentColor(color))) {
        return play;
      }
    }

    return null;
  }

  private computePossibleSituation(board: Board, pieces: Piece[]): Situation[] {
    const opponentBoards: Situation[] = [];

    for (let piece of pieces) {
      const moves = board.computePossibleDestinations(piece);
      for (let move of moves) {
        const nextBoard = Board.copy(board);
        const play = nextBoard.applyMove({ from: piece.position, to: move });
        opponentBoards.push({ board: nextBoard, play });
      }
    }

    return opponentBoards;
  }

  private createOpponentPlays(board: Board, opponentPiece: Piece, opponentMoves: Position[]): Situation[] {
    return opponentMoves.map((opponentMove) => {
      const opponentBoard = Board.copy(board);
      const opponentPlay = opponentBoard.applyMove({ from: opponentPiece.position, to: opponentMove });

      return { board: opponentBoard, play: opponentPlay } as Situation;
    });
  }

  private findMate(initialBoard: Board, color: PieceColor, deep: number, plays: Play[] = []): Play[] | null {
    const pieces = initialBoard.getPieces({ color });

    const situations = this.computePossibleSituation(initialBoard, pieces);
    const nextMate = this.findMateFromSituation(situations, color);
    if (nextMate) return [...plays, nextMate];

    if (deep > 1) {
      for (let situation of situations) {
        const { board, play } = situation;
        const opponentPieces = board.getPieces({ color: opponentColor(color) });
        for (let opponentPiece of opponentPieces) {
          const opponentMoves = board.computePossibleDestinations(opponentPiece);
          if (opponentMoves.length > 0) {
            const opponentPlays = this.createOpponentPlays(board, opponentPiece, opponentMoves);
            const { board: finalBoard, play: opponentPlay } = this.findDefensivePlay(opponentPlays);
            const matePlay = this.findMate(finalBoard, color, deep - 1, [...plays, play, opponentPlay]);
            if (matePlay) {
              return matePlay;
            }
          }
        }
      }
    }

    return null;
  }

  public find(board: Board, lastPlay?: Play): Suggestion | null {
    const color = lastPlay?.piece?.color || PieceColor.White;
    const king = this.isMate(board, color);
    if (king) {
      return { matePiece: king, type: SuggestionType.Mate };
    }

    const plays = this.findMate(board, color, 2);
    if (plays) {
      return { plays, type: SuggestionType.Move };
    }

    return null;
  }
}
