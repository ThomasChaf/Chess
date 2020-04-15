import { PIECES } from "./initial-state";
import { EPieceType, EPieceColor, Position, Move } from "./game-d";
import { isSameCase } from "./utils";
import { Piece } from "./piece";

export interface IFindPieceFilters {
  row?: number;
  col?: number;
  type?: EPieceType;
  color?: EPieceColor;
}

export class Board {
  private pieces: Piece[] = PIECES.map((p) => new Piece(p.type, p.color, p.row, p.col));

  public promote = (position: Position, promotion: EPieceType) =>
    this.pieces.map((piece: Piece) => {
      if (isSameCase(position, [piece.row, piece.col])) piece.type = promotion;

      return piece;
    });

  public getFilteredPieces = (filters: IFindPieceFilters): Piece[] =>
    this.pieces.filter(
      (p: Piece) =>
        (!filters.row || filters.row === p.row) &&
        (!filters.col || filters.col === p.col) &&
        (!filters.color || filters.color === p.color) &&
        (!filters.type || filters.type === p.type)
    );

  public getPieceAt = (position: Position): Piece | undefined =>
    this.pieces.find((p) => isSameCase([p.row, p.col], position));

  private isAvailable = (position: Position): boolean => {
    const [row, col] = position;
    if (row < 1 || row > 8 || col < 0 || col > 8) return false;

    return !this.getPieceAt(position);
  };

  private isEnnemy = (color: EPieceColor, position: Position): boolean => {
    const piece = this.getPieceAt(position);

    return !!piece && piece.color !== color;
  };

  private computePawnDestinations = (piece: Piece): Position[] => {
    const isWhite = piece.color === EPieceColor.White;
    const inc: number = isWhite ? 1 : -1;
    const moves = [
      [piece.row + inc, piece.col - 1] as Position,
      [piece.row + inc, piece.col + 1] as Position
    ].filter((position: Position) => this.isEnnemy(piece.color, position));

    const maxInc = (isWhite && piece.row === 2) || (!isWhite && piece.row === 7) ? 2 : 1;

    for (let i = 1; i <= maxInc; i++) {
      const virtualPosition = [piece.row + i * inc, piece.col] as Position;

      if (this.isAvailable(virtualPosition)) moves.push(virtualPosition);
      else break;
    }

    return moves;
  };

  private computeKnightDestinations = (piece: Piece): Position[] =>
    [
      [piece.row + 2, piece.col + 1] as Position,
      [piece.row + 2, piece.col - 1] as Position,
      [piece.row - 2, piece.col + 1] as Position,
      [piece.row - 2, piece.col - 1] as Position,
      [piece.row - 1, piece.col + 2] as Position,
      [piece.row - 1, piece.col - 2] as Position,
      [piece.row + 1, piece.col + 2] as Position,
      [piece.row + 1, piece.col - 2] as Position
    ].filter((position) => this.isAvailable(position) || this.isEnnemy(piece.color, position));

  private computeStraightMooves = (piece: Piece, dirRow: number, dirCol: number) => {
    const moves = [];

    for (let i = 1; i < 8; i++) {
      const virtualPosition = [piece.row + i * dirRow, piece.col + i * dirCol] as Position;

      if (this.isAvailable(virtualPosition)) {
        moves.push(virtualPosition);
      } else if (this.isEnnemy(piece.color, virtualPosition)) {
        moves.push(virtualPosition);
        break;
      } else break;
    }

    return moves;
  };

  private computeBishopDestinations = (piece: Piece): Position[] => [
    ...this.computeStraightMooves(piece, -1, -1),
    ...this.computeStraightMooves(piece, -1, 1),
    ...this.computeStraightMooves(piece, 1, -1),
    ...this.computeStraightMooves(piece, 1, 1)
  ];

  private computeQueenDestinations = (piece: Piece): Position[] => {
    return [
      ...this.computeStraightMooves(piece, -1, -1),
      ...this.computeStraightMooves(piece, -1, 0),
      ...this.computeStraightMooves(piece, 0, -1),
      ...this.computeStraightMooves(piece, -1, 1),
      ...this.computeStraightMooves(piece, 1, -1),
      ...this.computeStraightMooves(piece, 1, 0),
      ...this.computeStraightMooves(piece, 0, 1),
      ...this.computeStraightMooves(piece, 1, 1)
    ];
  };

  private computeTowerDestinations = (piece: Piece): Position[] => {
    return [
      ...this.computeStraightMooves(piece, -1, 0),
      ...this.computeStraightMooves(piece, 1, 0),
      ...this.computeStraightMooves(piece, 0, -1),
      ...this.computeStraightMooves(piece, 0, 1)
    ];
  };

  private computeKingDestinations = (piece: Piece): Position[] => {
    return [
      [piece.row - 1, piece.col - 1] as Position,
      [piece.row - 1, piece.col] as Position,
      [piece.row, piece.col - 1] as Position,
      [piece.row - 1, piece.col + 1] as Position,
      [piece.row + 1, piece.col - 1] as Position,
      [piece.row + 1, piece.col] as Position,
      [piece.row, piece.col + 1] as Position,
      [piece.row + 1, piece.col + 1] as Position
    ].filter(
      (virtualPostion: Position) => this.isAvailable(virtualPostion) || this.isEnnemy(piece.color, virtualPostion)
    );
  };

  private allowedDestination = (piece: Piece): Position[] => {
    switch (piece.type) {
      case EPieceType.Pawn:
        return this.computePawnDestinations(piece);
      case EPieceType.Knight:
        return this.computeKnightDestinations(piece);
      case EPieceType.Bishop:
        return this.computeBishopDestinations(piece);
      case EPieceType.Queen:
        return this.computeQueenDestinations(piece);
      case EPieceType.Tower:
        return this.computeTowerDestinations(piece);
      case EPieceType.King:
        return this.computeKingDestinations(piece);
      default:
        throw new Error("Not implemented pieced");
    }
  };

  private isMoveAllowed = (piece: Piece, to: Position): boolean => {
    return !!this.allowedDestination(piece).find((d: Position) => isSameCase(d, to));
  };

  public findPiece = (filters: IFindPieceFilters, to: Position): Piece => {
    const piece = this.getFilteredPieces(filters).find((p) => this.isMoveAllowed(p, to));

    if (!piece) {
      throw new Error("No piece found");
    }

    return piece;
  };

  public applyMove = (move: Move) => {
    const [newRow, newCol] = move.to;
    this.pieces = this.pieces.map((piece: Piece) => {
      if (isSameCase([piece.row, piece.col], move.from)) {
        piece.row = newRow;
        piece.col = newCol;
      }
      return piece;
    });
  };

  public take = (taken: Position) => {
    this.pieces = this.pieces.filter((piece) => !isSameCase([piece.row, piece.col], taken));
  };

  public reset = () => {
    this.pieces = PIECES.map((p) => new Piece(p.type, p.color, p.row, p.col));
  };

  public getPieces = (): Piece[] => {
    return this.pieces;
  };
}
