import { PieceColor, PieceType, Play } from "core/chess";
import { Board } from "core/chess/board";
import { comparePlay, opponentColor } from "core/chess/utils";
import { Move } from "./position";
import { displayPlay } from "./utils";

export class Analyst {
  static computeMoves(initialBoard: Board, color: PieceColor, depth: number): Move[] {
    if (depth === 0) return [];

    const moves: Move[] = [];
    const pieces = initialBoard.getPieces({ color });

    if (depth === 2) {
      console.log(pieces);
    }

    for (let piece of pieces) {
      const destinations = initialBoard.computePossibleDestinations(piece);
      for (let destination of destinations) {
        const board = Board.copy(initialBoard);
        const play = board.applyMove({ from: piece.position, to: destination });
        const move = new Move(board, play);
        if (
          depth === 2 &&
          comparePlay(play, {
            move: { from: [5, 6], to: [7, 6] },
            piece: {
              id: "3",
              type: PieceType.Queen,
              color: PieceColor.White,
              row: 6,
              col: 7
            }
          } as Play)
        ) {
          debugger;
          console.log(play);
          board.display();
          console.log(move.opponentMoves);

          move.opponentMoves = Analyst.computeMoves(board, opponentColor(color), depth - 1).filter((opponentMove) => {
            return opponentMove.analyse && !opponentMove.analyse.kingAttacked;
          });
          move.opponentMoves.forEach((x) => {
            console.log(displayPlay(x.lastPlay));
          });
        } else {
          move.opponentMoves = Analyst.computeMoves(board, opponentColor(color), depth - 1);
        }

        move.computeAnalyse(color);
        moves.push(move);
      }
    }

    return moves;
  }

  public find(board: Board, lastPlay: Play): Play[] | null {
    console.time("concatenation");
    const color = opponentColor(lastPlay.piece.color) || PieceColor.White;

    console.log(lastPlay, color);

    const myMoves = Analyst.computeMoves(board, color, 2);
    console.log(myMoves);
    for (let move of myMoves) {
      if (move.analyse?.checkMate) return [move.lastPlay];
    }

    return null;
  }
}
