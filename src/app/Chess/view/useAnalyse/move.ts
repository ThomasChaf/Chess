import _ from "lodash";
import { PieceColor, Play } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Analyse } from "./analyst.types";
import { displayPlay, getKing } from "./utils";

export class Move {
  analyse: Analyse | undefined;
  opponentMoves: Move[] = [];
  board: Board;
  lastPlay: Play;
  id: string;
  path: Move[];

  constructor(board: Board, lastPlay: Play, path: Move[] = []) {
    this.board = board;
    this.id = _.uniqueId();
    this.lastPlay = lastPlay;
    this.path = path;
  }

  // if move is better than current return 1 otherwise -1
  public compare(move: Move): number {
    if (move.analyse?.checkMate || move.analyse?.forcedMate) return 1;

    if (move.analyse?.opponentKingAttacked && !this.analyse?.opponentKingAttacked) return 1;
    if (!move.analyse?.opponentKingAttacked && this.analyse?.opponentKingAttacked) return -1;
    return this.opponentMoves.length - move.opponentMoves.length;
  }

  public computePreAnalyse(color: PieceColor): boolean {
    const king = getKing(this.board, color);
    const opponentKing = getKing(this.board, opponentColor(color));
    if (!king || !opponentKing) return true;

    return this.board.isPositionDefended(king.position, color);
  }

  public computePostAnalyse(color: PieceColor) {
    const opponentKing = getKing(this.board, opponentColor(color));

    const opponentKingAttacked = this.board.isPositionDefended(opponentKing.position, opponentColor(color));

    this.analyse = {
      checkMate: false,
      forcedMate: false,
      opponentKingAttacked
    };
    this.analyse.checkMate = opponentKingAttacked && this.opponentMoves.every((move) => move.analyse?.forcedMate);
    this.analyse.forcedMate = this.opponentMoves.some((move) => move.analyse?.checkMate);
  }

  public display() {
    console.log("DISPLAY MOVE: ============", this.analyse);
    this.board.display();
    displayPlay(this.lastPlay, "MY");
    this.opponentMoves.forEach((x) => {
      displayPlay(x.lastPlay, "O:");
    });
  }
}
