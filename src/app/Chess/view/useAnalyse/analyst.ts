import { PieceColor, Play } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Move } from "./move";

export class Analyst {
  moves: Move[] | null = null;

  findBestMove(): Move | undefined {
    if (!this.moves) return;
    return this.moves.filter((move: Move) => move.analyse?.checkMate)[0];
  }

  computeMoves(initialBoard: Board, color: PieceColor, depth: number, moves: Move[] | null): Move[] | null {
    if (depth === 0) return null;

    if (moves) {
      for (let move of moves) {
        const { board } = move;
        const opp = this.computeMoves(board, opponentColor(color), depth - 1, move.opponentMoves);
        if (!move.opponentMoves) {
          move.opponentMoves = opp;
        }
        move.computePostAnalyse(color);
        if (move.analyse?.checkMate) return null;
      }
      return null;
    }

    let newMoves: Move[] = [];
    const pieces = initialBoard.getPieces(color);

    for (let piece of pieces) {
      const destinations = initialBoard.computePossibleDestinations(piece);
      for (let destination of destinations) {
        const board = Board.copy(initialBoard);
        const play = board.applyMove({ from: piece.position, to: destination });
        const move = new Move(board, play);
        const forbidden = move.computePreAnalyse(color);
        if (forbidden) continue;

        move.opponentMoves = this.computeMoves(board, opponentColor(color), depth - 1, null);

        move.computePostAnalyse(color);
        newMoves.push(move);
      }
    }

    newMoves.sort((m1, m2) => m1.compare(m2));
    if (newMoves[0]?.analyse?.checkMate) {
      newMoves = [newMoves[0]];
    }

    if (newMoves.length === 1 && depth === 1) {
      const forcedMove = newMoves[0];
      forcedMove.opponentMoves = this.computeMoves(forcedMove.board, opponentColor(color), depth + 1, null);
      forcedMove.computePostAnalyse(color);
    }

    return newMoves;
  }

  static find(board: Board, lastPlay: Play): Move | undefined {
    const color = opponentColor(lastPlay.piece.color) || PieceColor.White;

    const analyst = new Analyst();

    let depth = 1;
    while (depth < 5) {
      const moves = analyst.computeMoves(board, color, depth, analyst.moves);
      if (!analyst.moves) {
        analyst.moves = moves;
      }

      const checkMove = analyst.findBestMove();
      if (checkMove) return checkMove;

      depth++;
    }

    return undefined;
  }
}
