import { Move, EPieceColor, EPieceType, Position, Play } from "./game-d";
import { parseCol, parseRow, parseType } from "./utils";
import { Piece } from "./piece";
import { Game } from "./game";

class GameFactory {
  private game: Game = new Game();

  private pawnMove = (color: EPieceColor, moveBlob: string): Move => {
    const to = [parseRow(moveBlob[1]), parseCol(moveBlob[0])] as Position;

    const piece: Piece = this.game.board.findPiece({ type: EPieceType.Pawn, color }, to);

    return {
      from: [piece.row, piece.col],
      to
    } as Move;
  };

  private pieceMove = (color: EPieceColor, moveBlob: string): Move => {
    const type = parseType(moveBlob[0]);
    const to = [parseRow(moveBlob[2]), parseCol(moveBlob[1])] as Position;

    const piece: Piece = this.game.board.findPiece({ type, color }, to);

    return {
      from: [piece.row, piece.col],
      to
    } as Move;
  };

  private pawnTake = (color: EPieceColor, moveBlob: string): Move => {
    const col = parseCol(moveBlob[0]);
    const to = [parseRow(moveBlob[3]), parseCol(moveBlob[2])] as Position;

    const piece: Piece = this.game.board.findPiece({ type: EPieceType.Pawn, color, col }, to);

    return {
      from: [piece.row, piece.col],
      to
    } as Move;
  };

  private pieceTake = (color: EPieceColor, moveBlob: string): Move => {
    const type = parseType(moveBlob[0]);
    const to = [parseRow(moveBlob[3]), parseCol(moveBlob[2])] as Position;

    const piece: Piece = this.game.board.findPiece({ type, color }, to);

    return {
      from: [piece.row, piece.col],
      to
    } as Move;
  };

  private kingRock = (color: EPieceColor, moveBlob: string): Move[] => {
    const isQueenSideRock = moveBlob.match(/O-O-O/) != null;

    if (color === EPieceColor.White && isQueenSideRock) {
      return [
        { from: [1, 5], to: [1, 3] },
        { from: [1, 1], to: [1, 4] }
      ];
    }
    if (color === EPieceColor.White && !isQueenSideRock) {
      return [
        { from: [1, 5], to: [1, 7] },
        { from: [1, 8], to: [1, 6] }
      ];
    }
    if (color === EPieceColor.Black && isQueenSideRock) {
      return [
        { from: [8, 5], to: [8, 3] },
        { from: [8, 1], to: [8, 4] }
      ];
    }
    if (color === EPieceColor.Black && !isQueenSideRock) {
      return [
        { from: [8, 5], to: [8, 7] },
        { from: [8, 8], to: [8, 6] }
      ];
    }

    throw new Error("This rock is impossible");
  };

  private parsePlay = (color: EPieceColor, playBlob: string): Play => {
    if (playBlob.match(/^[a-h]\d\+?#?$/) != null) {
      const move = this.pawnMove(color, playBlob);

      // console.log(move);
      return { moves: [move], taken: null };
    }
    if (playBlob.match(/^[KQRBN][a-h]\d\+?#?$/) != null) {
      const move = this.pieceMove(color, playBlob);

      // console.log(move);
      return { moves: [move], taken: null };
    }
    if (playBlob.match(/^[a-h]x[a-h]\d\+?#?$/) != null) {
      const move = this.pawnTake(color, playBlob);

      // console.log(move);
      return { moves: [move], taken: move.to };
    }
    if (playBlob.match(/^[KQRBN]x[a-h]\d\+?#?$/) != null) {
      const move = this.pieceTake(color, playBlob);

      // console.log(move);
      return { moves: [move], taken: move.to };
    }
    if (playBlob.match(/^O-O(-O)?\+?#?$/) != null) {
      const moves = this.kingRock(color, playBlob);

      // console.log(moves);
      return { moves, taken: null };
    }
    if (playBlob.match(/^(1-0)|(0-1)$/) != null) {
      return { moves: [], taken: null };
    }

    throw new Error(`Not implemented play ${playBlob}`);
  };

  public parseMoves = (movesBlob: string) => {
    movesBlob.split(/\d+\./).forEach((playBlob) => {
      if (!playBlob.length) return;

      const [whiteMove, blackMove] = playBlob.replace(/\d\./, "").trim().split(" ");

      this.game.play(this.parsePlay(EPieceColor.White, whiteMove));
      this.game.play(this.parsePlay(EPieceColor.Black, blackMove));
    });
  };

  public parse = (blob: string) => {
    const isMoveLines = (line: string): boolean => {
      if (line.length === 0) return false;

      if (line.match(/^\[.*\]$/)) return false;

      return true;
    };

    blob.split("\n").filter(isMoveLines).forEach(this.parseMoves);
  };

  public reset = () => {
    this.game.board.reset();
  };

  public getGame = (): Game => this.game;
}

export const parse = (blob: string): Game => {
  const factory = new GameFactory();

  factory.parse(blob);

  factory.reset();

  return factory.getGame();
};
