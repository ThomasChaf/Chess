import _ from "lodash";
import { PieceColor, Play } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Report, REPORT_TYPE } from "./report";
import { displayPlay, getKing } from "./utils";

export class Position {
  board: Board;
  id: string;
  lastPlay: Play;
  opponentPositions: Position[] = [];
  path: Position[];
  report: Report;

  constructor(board: Board, lastPlay: Play, path: Position[] = []) {
    this.report = new Report();
    this.board = board;
    this.id = _.uniqueId();
    this.lastPlay = lastPlay;
    this.path = path;
  }

  // if position is better than current return 1 otherwise -1
  public compare(position: Position): number {
    const reportDiff = this.report.compare(position.report);
    if (reportDiff !== 0) return reportDiff;

    return this.opponentPositions.length - position.opponentPositions.length;
  }

  public computePreAnalyse(color: PieceColor) {
    const king = getKing(this.board, color);
    const opponentKing = getKing(this.board, opponentColor(color));

    if (!king || !opponentKing || this.board.isPositionDefended(king.position, color)) {
      this.report.setType(REPORT_TYPE.forbidden);
      return;
    }

    if (this.board.isPositionDefended(opponentKing.position, opponentColor(color))) {
      this.report.setType(REPORT_TYPE.check);
      return;
    }
  }

  public computePostAnalyse() {
    if (this.report.is(REPORT_TYPE.check) && this.opponentPositions.length === 0) {
      this.report.setType(REPORT_TYPE.checkMate, { checkIn: 1 });
      return;
    }
  }

  public display() {
    console.log("DISPLAY MOVE: ============", this.report.toString());
    this.board.display();
    displayPlay(this.lastPlay, "MY");
    this.opponentPositions.forEach((x) => {
      displayPlay(x.lastPlay, "O:");
    });
  }
}
