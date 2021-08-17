import { Move, PieceColor, PieceType, Position, Play, Promotion } from "./chess-d";
import { parseCol, parseRow, parseType, isSameCase, isPawn } from "./utils";
import { Piece } from "./piece";
import { Game } from "./game";

class GameFactory {
  private game: Game = new Game();

  private pawnMove = (color: PieceColor, moveBlob: string): Move => {
    const to = [parseRow(moveBlob[1]), parseCol(moveBlob[0])] as Position;

    const piece: Piece = this.game.board.findPiece({ type: PieceType.Pawn, color }, to);

    return { from: piece.position, to };
  };

  private pieceMove = (color: PieceColor, moveBlob: string, withColumn: boolean = false): Move => {
    const type = parseType(moveBlob[0]);
    const col = withColumn ? parseCol(moveBlob[1]) : 0;
    const to: Position = withColumn
      ? [parseRow(moveBlob[3]), parseCol(moveBlob[2])]
      : [parseRow(moveBlob[2]), parseCol(moveBlob[1])];

    const piece: Piece = this.game.board.findPiece({ type, col, color }, to);

    return { from: piece.position, to };
  };

  private checkEnPassant = (color: PieceColor, moveBlob: string): Play | null => {
    const col = parseCol(moveBlob[0]);
    const to = [parseRow(moveBlob[3]), parseCol(moveBlob[2])] as Position;
    const lastPlay = this.game.history[this.game.history.length - 1];
    if (!lastPlay) return null;
    const lastMove = lastPlay.move;
    const lastMovedPiece = this.game.board.getPieceAt(lastMove.to);
    const pawn = this.game.board.getPieceAt([lastMove.to[0], col]);

    if (!isPawn(pawn) || pawn.color !== color || !isPawn(lastMovedPiece)) return null;

    if (lastMove.to[0] - lastMove.from[0] !== 2) return null;

    const enPassantPosition = [lastMove.to[0] - (color === PieceColor.White ? -1 : 1), lastMove.to[1]] as Position;

    if (isSameCase(to, enPassantPosition)) {
      return {
        move: { from: pawn.position, to },
        taken: this.game.board.getPieceAt(lastMove.to)
      };
    }

    return null;
  };

  private pawnTake = (color: PieceColor, moveBlob: string): Move => {
    const col = parseCol(moveBlob[0]);
    const to = [parseRow(moveBlob[3]), parseCol(moveBlob[2])] as Position;

    const piece: Piece = this.game.board.findPiece({ type: PieceType.Pawn, color, col }, to);

    return { from: piece.position, to };
  };

  private pieceTake = (color: PieceColor, moveBlob: string, withColumn: boolean = false): Move => {
    console.log(moveBlob);

    const type = parseType(moveBlob[0]);
    const col = withColumn ? parseCol(moveBlob[1]) : 0;
    const to: Position = withColumn
      ? [parseRow(moveBlob[4]), parseCol(moveBlob[3])]
      : [parseRow(moveBlob[3]), parseCol(moveBlob[2])];

    const piece: Piece = this.game.board.findPiece({ type, color, col }, to);

    return { from: piece.position, to };
  };

  private kingRock = (color: PieceColor, moveBlob: string): Move[] => {
    const isQueenSideRock = moveBlob.match(/O-O-O/) != null;

    if (color === PieceColor.White && isQueenSideRock) {
      return [
        { from: [1, 5], to: [1, 3] },
        { from: [1, 1], to: [1, 4] }
      ];
    }
    if (color === PieceColor.White && !isQueenSideRock) {
      return [
        { from: [1, 5], to: [1, 7] },
        { from: [1, 8], to: [1, 6] }
      ];
    }
    if (color === PieceColor.Black && isQueenSideRock) {
      return [
        { from: [8, 5], to: [8, 3] },
        { from: [8, 1], to: [8, 4] }
      ];
    }
    if (color === PieceColor.Black && !isQueenSideRock) {
      return [
        { from: [8, 5], to: [8, 7] },
        { from: [8, 8], to: [8, 6] }
      ];
    }

    throw new Error("This rock is impossible");
  };

  private parsePromotion = (playBlob: string, play: Play): Promotion | undefined => {
    const res = playBlob.match(/^.*=([RKBQ]).*$/);

    if (!res) return;
    const piece = this.game.board.getPieceAt(play.move.from) as Piece;

    return { from: piece.type, to: parseType(res[1]) };
  };

  private computePrimitifPlay = (color: PieceColor, playBlob: string): Play => {
    if (playBlob.match(/^[a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      return { move: this.pawnMove(color, playBlob) };
    }

    if (playBlob.match(/^[KQRBN][a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      return { move: this.pieceMove(color, playBlob) };
    }

    if (playBlob.match(/^[KQRBN][a-h][a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      return { move: this.pieceMove(color, playBlob, true) };
    }

    if (playBlob.match(/^[a-h]x[a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      const play = this.checkEnPassant(color, playBlob);
      if (play) return play;

      return { move: this.pawnTake(color, playBlob) };
    }

    if (playBlob.match(/^[KQRBN]x[a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      return { move: this.pieceTake(color, playBlob) };
    }

    if (playBlob.match(/^[KQRBN][a-h]x[a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      return { move: this.pieceTake(color, playBlob, true) };
    }

    if (playBlob.match(/^O-O(-O)?(=[RKBQ])?\+?#?$/) != null) {
      const [move, rock] = this.kingRock(color, playBlob);

      return { move, rock };
    }

    throw new Error(`Not implemented play ${playBlob}`);
  };

  private parsePlay = (color: PieceColor, playBlob: string): Play | null => {
    if (playBlob.match(/^(1-0)|(0-1)|(1\/2-1\/2)$/) != null) {
      return null;
    }
    const play = this.computePrimitifPlay(color, playBlob);

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
