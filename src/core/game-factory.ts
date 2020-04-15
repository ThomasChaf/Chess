import { Move, EPieceColor, EPieceType, Position, Play } from "./game-d";
import { parseCol, parseRow, parseType, isSameCase, isPawn } from "./utils";
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

  private checkEnPassant = (color: EPieceColor, moveBlob: string): Play | null => {
    const col = parseCol(moveBlob[0]);
    const to = [parseRow(moveBlob[3]), parseCol(moveBlob[2])] as Position;
    const lastPlay = this.game.history[this.game.history.length - 1];
    if (!lastPlay) return null;
    const lastMove = lastPlay.moves[0];
    const lastMovedPiece = this.game.board.getPieceAt(lastMove.to);
    const pawn = this.game.board.getPieceAt([lastMove.to[0], col]);

    if (!isPawn(pawn) || pawn.color !== color || !isPawn(lastMovedPiece)) return null;

    if (lastMove.to[0] - lastMove.from[0] !== 2) return null;

    const enPassantPosition = [lastMove.to[0] - (color === EPieceColor.White ? -1 : 1), lastMove.to[1]] as Position;

    if (isSameCase(to, enPassantPosition)) {
      return {
        moves: [{ from: [pawn.row, pawn.col], to }],
        taken: lastMove.to,
        promotion: null
      };
    }

    return null;
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

  private parsePromotion = (playBlob: string): EPieceType | null => {
    const res = playBlob.match(/^.*=([RKBQ]).*$/);

    if (!res) return null;

    return parseType(res[1]);
  };

  private parsePlay = (color: EPieceColor, playBlob: string): Play => {
    const promotion = this.parsePromotion(playBlob);

    if (playBlob.match(/^[a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      const move = this.pawnMove(color, playBlob);

      return { moves: [move], taken: null, promotion };
    }
    if (playBlob.match(/^[KQRBN][a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      const move = this.pieceMove(color, playBlob);

      return { moves: [move], taken: null, promotion };
    }
    if (playBlob.match(/^[a-h]x[a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      const play = this.checkEnPassant(color, playBlob);
      if (play) return play;

      const move = this.pawnTake(color, playBlob);

      return { moves: [move], taken: move.to, promotion };
    }
    if (playBlob.match(/^[KQRBN]x[a-h]\d(=[RKBQ])?\+?#?$/) != null) {
      const move = this.pieceTake(color, playBlob);

      return { moves: [move], taken: move.to, promotion };
    }
    if (playBlob.match(/^O-O(-O)?(=[RKBQ])?\+?#?$/) != null) {
      const moves = this.kingRock(color, playBlob);

      console.log(moves);
      return { moves, taken: null, promotion };
    }
    if (playBlob.match(/^(1-0)|(0-1)|(1\/2-1\/2)$/) != null) {
      return { moves: [], taken: null, promotion };
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
