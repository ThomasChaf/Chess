import _ from "lodash";

import { PieceColor, PieceType, BoardPosition, Play, Promotion } from "./chess-d";
import { parseCol, parseRow, parseType, isSameBox, isPawn } from "./utils";
import { Piece } from "./piece";
import { Game } from "./game";
import { PieceFilters } from "./board";

class GameFactory {
  private game: Game = new Game();

  private findPiece = (filters: PieceFilters, to: BoardPosition): Piece => {
    const piece = this.game.board.getPieces(filters).find((piece) => {
      return _(this.game.board.computePossibleDestinations(piece)).some((d: BoardPosition) => isSameBox(d, to));
    });

    if (!piece) {
      debugger;
      throw new Error("No piece found");
    }

    return piece;
  };

  private pawnPlay = (color: PieceColor, moveBlob: string): Play => {
    const to = [parseCol(moveBlob[0]), parseRow(moveBlob[1])] as BoardPosition;

    const piece = this.findPiece({ type: PieceType.Pawn, color }, to);

    return { move: { from: piece.position, to }, piece };
  };

  private piecePlay = (color: PieceColor, moveBlob: string, withColumn: boolean = false): Play => {
    const type = parseType(moveBlob[0]);
    const col = withColumn ? parseCol(moveBlob[1]) : 0;
    const to: BoardPosition = withColumn
      ? [parseCol(moveBlob[2]), parseRow(moveBlob[3])]
      : [parseCol(moveBlob[1]), parseRow(moveBlob[2])];

    const piece = this.findPiece({ type, col, color }, to);

    return { move: { from: piece.position, to }, piece };
  };

  private checkEnPassant = (color: PieceColor, moveBlob: string): Play | null => {
    const col = parseCol(moveBlob[0]);
    const to = [parseRow(moveBlob[3]), parseCol(moveBlob[2])] as BoardPosition;
    const lastPlay = this.game.history[this.game.history.length - 1];
    if (!lastPlay) return null;
    const lastMove = lastPlay.move;
    const pawn = this.game.board.getPieceAt([lastMove.to[0], col]);

    if (!isPawn(pawn) || pawn.color !== color || !isPawn(lastPlay.piece)) return null;

    if (lastMove.to[0] - lastMove.from[0] !== 2) return null;

    const enPassantPosition = [lastMove.to[0] - (color === PieceColor.White ? -1 : 1), lastMove.to[1]] as BoardPosition;

    if (isSameBox(to, enPassantPosition)) {
      return {
        move: { from: pawn.position, to },
        piece: pawn,
        taken: this.game.board.getPieceAt(lastMove.to)
      };
    }

    return null;
  };

  private pawnTake = (color: PieceColor, moveBlob: string): Play => {
    const col = parseCol(moveBlob[0]);
    const to = [parseCol(moveBlob[2]), parseRow(moveBlob[3])] as BoardPosition;

    const piece: Piece = this.findPiece({ type: PieceType.Pawn, color, col }, to);

    return { move: { from: piece.position, to }, piece };
  };

  private pieceTake = (color: PieceColor, moveBlob: string, withColumn: boolean = false): Play => {
    const type = parseType(moveBlob[0]);
    const col = withColumn ? parseCol(moveBlob[1]) : 0;
    const to: BoardPosition = withColumn
      ? [parseCol(moveBlob[3]), parseRow(moveBlob[4])]
      : [parseCol(moveBlob[2]), parseRow(moveBlob[3])];

    const piece: Piece = this.findPiece({ type, color, col }, to);

    return { move: { from: piece.position, to }, piece };
  };

  private kingRock = (color: PieceColor, moveBlob: string): Play => {
    const isQueenSideRock = moveBlob.match(/O-O-O/) != null;
    const king = this.game.board.getPieces({ type: PieceType.King, color })[0];

    if (color === PieceColor.White && isQueenSideRock) {
      return {
        move: { from: [5, 1], to: [3, 1] },
        rock: { from: [1, 1], to: [4, 1] },
        piece: king
      };
    }
    if (color === PieceColor.White && !isQueenSideRock) {
      return {
        move: { from: [5, 1], to: [7, 1] },
        rock: { from: [8, 1], to: [6, 1] },
        piece: king
      };
    }
    if (color === PieceColor.Black && isQueenSideRock) {
      return {
        move: { from: [5, 8], to: [3, 8] },
        rock: { from: [1, 8], to: [4, 8] },
        piece: king
      };
    }
    if (color === PieceColor.Black && !isQueenSideRock) {
      return {
        move: { from: [5, 8], to: [7, 8] },
        rock: { from: [8, 8], to: [6, 8] },
        piece: king
      };
    }

    throw new Error("This rock is impossible");
  };

  private parsePromotion = (playBlob: string, play: Play): Promotion | undefined => {
    const res = playBlob.match(/^.*=([RKBQ]).*$/);

    if (!res) return;
    const piece = this.game.board.getPieceAt(play.move.from) as Piece;

    return { from: piece.type, to: parseType(res[1]) };
  };

  private computeRawPlay = (color: PieceColor, playBlob: string): Play => {
    if (playBlob.match(/^[a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      return this.pawnPlay(color, playBlob);
    }

    if (playBlob.match(/^[KQRBN][a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      return this.piecePlay(color, playBlob);
    }

    if (playBlob.match(/^[KQRBN][a-h][a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      return this.piecePlay(color, playBlob, true);
    }

    if (playBlob.match(/^[a-h]x[a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      const play = this.checkEnPassant(color, playBlob);
      if (play) return play;

      return this.pawnTake(color, playBlob);
    }

    if (playBlob.match(/^[KQRBN]x[a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      return this.pieceTake(color, playBlob);
    }

    if (playBlob.match(/^[KQRBN][a-h]x[a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      return this.pieceTake(color, playBlob, true);
    }

    if (playBlob.match(/^O-O(-O)?(=[RKBQ])?\+?#?$/) != null) {
      return this.kingRock(color, playBlob);
    }

    throw new Error(`Not implemented play ${playBlob}`);
  };

  private parsePlay = (color: PieceColor, playBlob: string): Play | null => {
    if (playBlob.match(/^(1-0)|(0-1)|(1\/2-1\/2)$/) != null) {
      return null;
    }
    const play = this.computeRawPlay(color, playBlob);

    if (!play.taken) play.taken = this.game.board.getPieceAt(play.move.to);

    play.promotion = this.parsePromotion(playBlob, play);

    return play;
  };

  public parseLines = (lineBlob: string) => {
    lineBlob.split(/\d+\./).forEach((playBlob) => {
      if (!playBlob.length) return;

      const [whiteMove, blackMove] = playBlob.replace(/\d\./, "").trim().split(" ");

      const whitePlay = this.parsePlay(PieceColor.White, whiteMove);
      whitePlay && this.game.play(whitePlay);

      const blackPlay = this.parsePlay(PieceColor.Black, blackMove);
      blackPlay && this.game.play(blackPlay);
    });
  };

  public parse = (blob: string): Game => {
    const isMoveLines = (line: string): boolean => {
      if (line.length === 0) return false;

      if (line.match(/^\[.*\]$/)) return false;

      return true;
    };

    blob.split("\n").filter(isMoveLines).forEach(this.parseLines);

    this.game.board.reset();

    return this.game;
  };
}

export const parse = (blob: string): Game => {
  const factory = new GameFactory();

  return factory.parse(blob);
};
