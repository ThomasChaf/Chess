import { Piece, PieceColor, PieceType, Play } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Situation, Suggestion, SuggestionType } from "./analyst.types";

export class Analyst {
  private test: number = 0;
  private isMate(board: Board, color: PieceColor): Piece | null {
    const opponentKing = board.getPieces({ type: PieceType.King, color })[0];
    const moves = board.computePossibleDestinations(opponentKing);

    return board.isPositionDefended(opponentKing.position, color) && moves.length === 0 ? opponentKing : null;
  }

  private findDefensivePlay(plays: Situation[]): Situation {
    return plays[0];
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

  private findOpponentPlay() {}

  private findMate(initialBoard: Board, color: PieceColor, deep: number, plays: Play[] = []): Play[] | null {
    const pieces = initialBoard.getPieces({ color });

    const situations = this.computePossibleSituation(initialBoard, pieces);
    const nextMate = this.findMateFromSituation(situations, color);
    if (nextMate) return [...plays, nextMate];
    this.test = this.test + 1;

    for (let situation of situations) {
      const { board, play } = situation;
      for (let i = 0; i < pieces.length; i++) {
        if (deep > 1) {
          const opponentPieces = board.getPieces({ color: opponentColor(color) });
          for (let j = 0; j < opponentPieces.length; j++) {
            const opponentPiece = opponentPieces[j];
            const opponentMoves = board.computePossibleDestinations(opponentPiece);
            if (opponentMoves.length > 0) {
              const opponentPlays = opponentMoves.map((opponentMove) => {
                const opponentBoard = Board.copy(board);
                const opponentPlay = opponentBoard.applyMove({ from: opponentPiece.position, to: opponentMove });

                return { board: opponentBoard, play: opponentPlay } as Situation;
              });
              const { board: finalBoard, play: opponentPlay } = this.findDefensivePlay(opponentPlays);
              const matePlay = this.findMate(finalBoard, color, deep - 1, [...plays, play, opponentPlay]);
              if (matePlay) {
                return matePlay;
              }
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

    this.test = 0;
    const plays = this.findMate(board, color, 2);
    if (plays) {
      return { plays, type: SuggestionType.Move };
    }

    return null;
  }
}
