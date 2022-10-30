import _ from "lodash";
import { PieceColor, Play } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Analyse } from "./analyst.types";
import { displayPlay, getKing } from "./utils";

export class Position {
  analyse: Analyse | undefined;
  opponentPositions: Position[] = [];
  board: Board;
  lastPlay: Play;
  id: string;
  path: Position[];

  constructor(board: Board, lastPlay: Play, path: Position[] = []) {
    this.board = board;
    this.id = _.uniqueId();
    this.lastPlay = lastPlay;
    this.path = path;
  }

  // if move is better than current return 1 otherwise -1
  public compare(position: Position): number {
    if (position.analyse?.checkMate || position.analyse?.forcedMate) return 1;

    if (position.analyse?.opponentKingAttacked && !this.analyse?.opponentKingAttacked) return 1;
    if (!position.analyse?.opponentKingAttacked && this.analyse?.opponentKingAttacked) return -1;
    return this.opponentPositions.length - position.opponentPositions.length;
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
    this.analyse.checkMate = opponentKingAttacked && this.opponentPositions.every((move) => move.analyse?.forcedMate);
    this.analyse.forcedMate = this.opponentPositions.some((move) => move.analyse?.checkMate);
  }

  public display() {
    console.log("DISPLAY MOVE: ============", this.analyse);
    this.board.display();
    displayPlay(this.lastPlay, "MY");
    this.opponentPositions.forEach((x) => {
      displayPlay(x.lastPlay, "O:");
    });
  }
}
