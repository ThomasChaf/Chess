import { PieceColor, PieceType, Play } from "core/chess";
import { Board } from "core/chess/board";

export const displayPlay = (play: Play | undefined, suffix: string = "") => {
  if (!play) {
    console.log("NO PLAY");
  } else {
    console.log(suffix, `${JSON.stringify(play.move)} ${play.piece.type} ${play.piece.color}`);
  }
};

export const getKing = (board: Board, color: PieceColor) => board.getPieces({ color, type: PieceType.King })[0];
