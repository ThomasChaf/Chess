import { Piece, PieceColor, Play, Position } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Situation, SituationAnalyse, Suggestion, SuggestionType } from "./analyst.types";
import { getKing } from "./utils";

export class Analyst {
  private i: number = 0;

  private isMate(board: Board, color: PieceColor): boolean {
    const king = getKing(board, color);
    const moves = board.computePossibleDestinations(king);

    return board.isPositionDefended(king.position, color) && moves.length === 0;
  }

  private analyseSituation(situation: Situation): SituationAnalyse {
    const { board, play } = situation;
    const color = play.piece.color;
    const king = getKing(board, color);

    return { kingAttacked: board.isPositionDefended(king.position, color) };
  }

  private findDefensivePlay(situations: Situation[]): Situation {
    const validPlays = situations.filter((situation) => {
      const { kingAttacked } = this.analyseSituation(situation);

      return !kingAttacked;
    });

    return validPlays[0];
  }

  private findMateFromSituation(situations: Situation[], color: PieceColor) {
    for (let situation of situations) {
      const { board, play } = situation;
      this.i += 1;

      if (this.isMate(board, opponentColor(color))) {
        board.display();
        console.log("HERE IS i:", this.i);

        return play;
      }
    }

    return null;
  }

  private computePossibleSituation(initialBoard: Board, pieces: Piece[]): Situation[] {
    const opponentBoards: Situation[] = [];

    for (let piece of pieces) {
      const moves = initialBoard.computePossibleDestinations(piece);
      for (let move of moves) {
        const board = Board.copy(initialBoard);
        const play = board.applyMove({ from: piece.position, to: move });
        opponentBoards.push({ board, play });
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
    console.time("concatenation");

    const color = lastPlay?.piece?.color || PieceColor.White;
    if (this.isMate(board, color)) {
      return { type: SuggestionType.Mate };
    }

    this.i = 0;

    const plays = this.findMate(board, color, 2);
    console.timeEnd("concatenation");
    if (plays) {
      return { plays, type: SuggestionType.Move };
    }

    return null;
  }
}
