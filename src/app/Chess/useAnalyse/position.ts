import { PieceColor, Play } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Analyse } from "./analyst.types";
import { getKing } from "./utils";

export class Move {
  analyse: Analyse | undefined;
  opponentMoves: Move[];
  board: Board;
  lastPlay: Play;

  constructor(board: Board, lastPlay: Play) {
    this.board = board;
    this.lastPlay = lastPlay;
    this.opponentMoves = [];
  }

  public computeAnalyse(color: PieceColor) {
    const king = getKing(this.board, color);
    const opponentKing = getKing(this.board, opponentColor(color));
    const opponentKingAttacked = this.board.isPositionDefended(opponentKing.position, opponentColor(color));

    this.analyse = {
      checkMate: opponentKingAttacked && this.opponentMoves.length === 0,
      kingAttacked: this.board.isPositionDefended(king.position, color),
      opponentKingAttacked
    };
  }
}
