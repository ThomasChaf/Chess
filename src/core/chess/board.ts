import _ from "lodash";

import { PIECES } from "./initial-state";
import { PieceType, PieceColor, Position, Move, Play } from "./chess-d";
import { isSameBox, opponentColor } from "./utils";
import { Piece } from "./piece";

export interface PieceFilters {
  row?: number;
  col?: number;
  type?: PieceType;
  color?: PieceColor;
}

export class Board {
  public pieces: Piece[];

  static copy(board: Board) {
    const pieces = board.pieces.map((piece) => Piece.copy(piece));

    return new Board(pieces);
  }

  constructor(pieces: Piece[] = PIECES.map((p) => new Piece(p.type, p.color, p.row, p.col))) {
    this.pieces = pieces;
  }

  public addPiece(piece: Piece) {
    this.pieces.push(piece);
  }

  public promote = (position: Position, promotion: PieceType) => {
    const piece = this.getPieceAt(position);
    if (piece) piece.type = promotion;
  };

  public getPieces = (filters?: PieceFilters): Piece[] => {
    if (!filters) return this.pieces;

    return this.pieces.filter(
      (p: Piece) =>
        (!filters.row || filters.row === p.row) &&
        (!filters.col || filters.col === p.col) &&
        (!filters.color || filters.color === p.color) &&
        (!filters.type || filters.type === p.type)
    );
  };

  public getPieceAt = (position: Position): Piece | undefined => {
    return this.pieces.find((p) => isSameBox([p.row, p.col], position));
  };

  private isExisting = (position: Position): boolean => {
    const [row, col] = position;
    return !(row < 1 || row > 8 || col < 0 || col > 8);
  };

  private isAvailable = (position: Position): boolean => {
    return this.isExisting(position) && !this.getPieceAt(position);
  };

  private isAlly = (color: PieceColor, position: Position): boolean => {
    return this.getPieceAt(position)?.color === color;
  };

  private isOpponent = (color: PieceColor, position: Position): boolean => {
    return this.getPieceAt(position)?.color === opponentColor(color);
  };

  public isPositionDefended = (position: Position, color: PieceColor): boolean => {
    const defended = _(this.pieces)
      .filter({ color: opponentColor(color) })
      .map((piece: Piece) => this.computeDefendedDestination(piece));

    const isDefended = defended.some((moves: Position[]) =>
      _(moves).some((move: Position) => isSameBox(move, position))
    );

    return isDefended;
  };

  private computePawnDefendedDestinations = (piece: Piece): Position[] => {
    const inc = piece.color === PieceColor.White ? 1 : -1;
    return [
      [piece.row + inc, piece.col - 1],
      [piece.row + inc, piece.col + 1]
    ];
  };

  private computePawnAttackDestination = (piece: Piece): Position[] => {
    return this.computePawnDefendedDestinations(piece).filter((position: Position) =>
      this.isOpponent(piece.color, position)
    );
  };

  private computePawnDestinations = (piece: Piece): Position[] => {
    const isWhite = piece.color === PieceColor.White;
    const inc = piece.color === PieceColor.White ? 1 : -1;
    const moves = this.computePawnAttackDestination(piece);
    const maxInc = (isWhite && piece.row === 2) || (!isWhite && piece.row === 7) ? 2 : 1;

    for (let i = 1; i <= maxInc; i++) {
      const virtualPosition: Position = [piece.row + i * inc, piece.col];

      if (this.isAvailable(virtualPosition)) moves.push(virtualPosition);
      else break;
    }

    return moves;
  };

  private computeKnightDefendedDestinations = (piece: Piece): Position[] =>
    (
      [
        [piece.row + 2, piece.col + 1],
        [piece.row + 2, piece.col - 1],
        [piece.row - 2, piece.col + 1],
        [piece.row - 2, piece.col - 1],
        [piece.row - 1, piece.col + 2],
        [piece.row - 1, piece.col - 2],
        [piece.row + 1, piece.col + 2],
        [piece.row + 1, piece.col - 2]
      ] as Position[]
    ).filter((position) => this.isExisting(position));

  private computeKnightDestinations = (piece: Piece): Position[] =>
    this.computeKnightDefendedDestinations(piece).filter(
      (position) => this.isAvailable(position) || this.isOpponent(piece.color, position)
    );

  private computeStraightMoves = (piece: Piece, dirRow: number, dirCol: number) => {
    const moves = [];

    for (let i = 1; i < 8; i++) {
      const virtualPosition = [piece.row + i * dirRow, piece.col + i * dirCol] as Position;

      if (this.isAvailable(virtualPosition)) {
        moves.push(virtualPosition);
      } else if (this.isOpponent(piece.color, virtualPosition)) {
        moves.push(virtualPosition);
        break;
      } else break;
    }

    return moves;
  };

  private computeBishopDestinations = (piece: Piece): Position[] => [
    ...this.computeStraightMoves(piece, -1, -1),
    ...this.computeStraightMoves(piece, -1, 1),
    ...this.computeStraightMoves(piece, 1, -1),
    ...this.computeStraightMoves(piece, 1, 1)
  ];

  private computeQueenDestinations = (piece: Piece): Position[] => {
    return [
      ...this.computeStraightMoves(piece, -1, -1),
      ...this.computeStraightMoves(piece, -1, 0),
      ...this.computeStraightMoves(piece, 0, -1),
      ...this.computeStraightMoves(piece, -1, 1),
      ...this.computeStraightMoves(piece, 1, -1),
      ...this.computeStraightMoves(piece, 1, 0),
      ...this.computeStraightMoves(piece, 0, 1),
      ...this.computeStraightMoves(piece, 1, 1)
    ];
  };

  private computeTowerDestinations = (piece: Piece): Position[] => {
    return [
      ...this.computeStraightMoves(piece, -1, 0),
      ...this.computeStraightMoves(piece, 1, 0),
      ...this.computeStraightMoves(piece, 0, -1),
      ...this.computeStraightMoves(piece, 0, 1)
    ];
  };

  private computeKingDefendedDestinations = (piece: Piece): Position[] => {
    return (
      [
        [piece.row - 1, piece.col - 1],
        [piece.row - 1, piece.col],
        [piece.row, piece.col - 1],
        [piece.row - 1, piece.col + 1],
        [piece.row + 1, piece.col - 1],
        [piece.row + 1, piece.col],
        [piece.row, piece.col + 1],
        [piece.row + 1, piece.col + 1]
      ] as Position[]
    ).filter((virtualPosition: Position) => this.isExisting(virtualPosition));
  };

  private computeKingDestinations = (piece: Piece): Position[] => {
    return this.computeKingDefendedDestinations(piece).filter(
      (virtualPosition: Position) =>
        !this.isAlly(piece.color, virtualPosition) && !this.isPositionDefended(virtualPosition, piece.color)
    );
  };

  public computePossibleDestinations = (piece: Piece): Position[] => {
    switch (piece.type) {
      case PieceType.Pawn:
        return this.computePawnDestinations(piece);
      case PieceType.Knight:
        return this.computeKnightDestinations(piece);
      case PieceType.Bishop:
        return this.computeBishopDestinations(piece);
      case PieceType.Queen:
        return this.computeQueenDestinations(piece);
      case PieceType.Tower:
        return this.computeTowerDestinations(piece);
      case PieceType.King:
        return this.computeKingDestinations(piece);
      default:
        throw new Error("Not implemented pieced");
    }
  };

  public computeDefendedDestination(piece: Piece): Position[] {
    switch (piece.type) {
      case PieceType.Pawn:
        return this.computePawnDefendedDestinations(piece);
      case PieceType.Knight:
        return this.computeKnightDefendedDestinations(piece);
      case PieceType.Bishop:
        return this.computeBishopDestinations(piece);
      case PieceType.Queen:
        return this.computeQueenDestinations(piece);
      case PieceType.Tower:
        return this.computeTowerDestinations(piece);
      case PieceType.King:
        return this.computeKingDefendedDestinations(piece);
      default:
        throw new Error("Not implemented pieced");
    }
  }

  private isMoveAllowed = (piece: Piece, to: Position): boolean => {
    return _(this.computePossibleDestinations(piece)).some((d: Position) => isSameBox(d, to));
  };

  public findPiece = (filters: PieceFilters, to: Position): Piece => {
    const piece = this.getPieces(filters).find((p) => this.isMoveAllowed(p, to));

    if (!piece) {
      throw new Error("No piece found");
    }

    return piece;
  };

  public applyMove = (move: Move): Play => {
    const [newRow, newCol] = move.to;

    const taken = this.getPieceAt(move.to);
    const piece = this.getPieceAt(move.from) as Piece;
    piece.row = newRow;
    piece.col = newCol;

    return {
      move,
      piece,
      taken
    };
  };

  public take = (taken: Position) => {
    this.pieces = this.pieces.filter((piece) => !isSameBox([piece.row, piece.col], taken));
  };

  public reset = () => {
    this.pieces = PIECES.map((p) => new Piece(p.type, p.color, p.row, p.col));
  };
}
