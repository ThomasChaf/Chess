import _ from "lodash";

import { PIECES } from "./initial-state";
import { PieceType, PieceColor, BoardPosition, Move, Play } from "./chess";
import { isSameBox, opponentColor } from "./utils";
import { Piece } from "./piece";

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

  public promote = (position: BoardPosition, promotion: PieceType) => {
    const piece = this.getPieceAt(position);
    if (piece) piece.type = promotion;
  };

  public getPieces = (filters?: Partial<Piece>): Piece[] => {
    if (!filters) return this.pieces;

    return _.filter(this.pieces, filters);
  };

  public getPieceAt = (position: BoardPosition): Piece | undefined => {
    return this.pieces.find((p) => isSameBox([p.col, p.row], position));
  };

  private isExisting = (position: BoardPosition): boolean => {
    const [col, row] = position;
    return !(row < 1 || row > 8 || col < 1 || col > 8);
  };

  private isAvailable = (position: BoardPosition): boolean => {
    return this.isExisting(position) && !this.getPieceAt(position);
  };

  private isAlly = (color: PieceColor, position: BoardPosition): boolean => {
    return this.getPieceAt(position)?.color === color;
  };

  private isOpponent = (color: PieceColor, position: BoardPosition): boolean => {
    return this.getPieceAt(position)?.color === opponentColor(color);
  };

  public isPositionDefended = (position: BoardPosition, color: PieceColor): boolean => {
    return _(this.pieces)
      .filter({ color: opponentColor(color) })
      .map((piece: Piece) => this.computeDefendedDestination(piece))
      .some((moves: BoardPosition[]) => _(moves).some((move: BoardPosition) => isSameBox(move, position)));
  };

  private computePawnDefendedDestinations = (piece: Piece): BoardPosition[] => {
    const inc = piece.color === PieceColor.White ? 1 : -1;
    return (
      [
        [piece.col - 1, piece.row + inc],
        [piece.col + 1, piece.row + inc]
      ] as BoardPosition[]
    ).filter((position) => this.isExisting(position));
  };

  private computePawnAttackableDestination = (piece: Piece): BoardPosition[] => {
    return this.computePawnDefendedDestinations(piece).filter((position: BoardPosition) =>
      this.isOpponent(piece.color, position)
    );
  };

  private computePawnDestinations = (piece: Piece): BoardPosition[] => {
    const isWhite = piece.color === PieceColor.White;
    const inc = piece.color === PieceColor.White ? 1 : -1;
    const moves = this.computePawnAttackableDestination(piece);
    const maxInc = (isWhite && piece.row === 2) || (!isWhite && piece.row === 7) ? 2 : 1;

    for (let i = 1; i <= maxInc; i++) {
      const virtualPosition: BoardPosition = [piece.col, piece.row + i * inc];

      if (this.isAvailable(virtualPosition)) moves.push(virtualPosition);
      else break;
    }

    return moves;
  };

  private computeKnightDefendedDestinations = (piece: Piece): BoardPosition[] =>
    (
      [
        [piece.col + 1, piece.row + 2],
        [piece.col - 1, piece.row + 2],
        [piece.col + 1, piece.row - 2],
        [piece.col - 1, piece.row - 2],
        [piece.col + 2, piece.row - 1],
        [piece.col - 2, piece.row - 1],
        [piece.col + 2, piece.row + 1],
        [piece.col - 2, piece.row + 1]
      ] as BoardPosition[]
    ).filter((position) => this.isExisting(position));

  private computeKnightDestinations = (piece: Piece): BoardPosition[] =>
    this.computeKnightDefendedDestinations(piece).filter(
      (position) => !this.getPieceAt(position) || this.isOpponent(piece.color, position)
    );

  private computeStraightMoves = (piece: Piece, dirRow: number, dirCol: number) => {
    const moves = [];

    for (let i = 1; i < 8; i++) {
      const virtualPosition = [piece.col + i * dirCol, piece.row + i * dirRow] as BoardPosition;

      if (this.isAvailable(virtualPosition)) {
        moves.push(virtualPosition);
      } else if (this.isOpponent(piece.color, virtualPosition)) {
        moves.push(virtualPosition);
        break;
      } else break;
    }

    return moves;
  };

  private computeBishopDestinations = (piece: Piece): BoardPosition[] => [
    ...this.computeStraightMoves(piece, -1, -1),
    ...this.computeStraightMoves(piece, -1, 1),
    ...this.computeStraightMoves(piece, 1, -1),
    ...this.computeStraightMoves(piece, 1, 1)
  ];

  private computeQueenDestinations = (piece: Piece): BoardPosition[] => {
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

  private computeTowerDestinations = (piece: Piece): BoardPosition[] => {
    return [
      ...this.computeStraightMoves(piece, -1, 0),
      ...this.computeStraightMoves(piece, 1, 0),
      ...this.computeStraightMoves(piece, 0, -1),
      ...this.computeStraightMoves(piece, 0, 1)
    ];
  };

  private computeKingDefendedDestinations = (piece: Piece): BoardPosition[] => {
    return (
      [
        [piece.col - 1, piece.row - 1],
        [piece.col, piece.row - 1],
        [piece.col - 1, piece.row],
        [piece.col + 1, piece.row - 1],
        [piece.col - 1, piece.row + 1],
        [piece.col, piece.row + 1],
        [piece.col + 1, piece.row],
        [piece.col + 1, piece.row + 1]
      ] as BoardPosition[]
    ).filter((virtualPosition: BoardPosition) => this.isExisting(virtualPosition));
  };

  private computeKingDestinations = (king: Piece): BoardPosition[] => {
    return this.computeKingDefendedDestinations(king).filter((virtualPosition: BoardPosition) => {
      const positionDefended = this.isPositionDefended(virtualPosition, king.color);
      return !this.isAlly(king.color, virtualPosition) && !positionDefended;
    });
  };

  public computePossibleDestinations = (piece: Piece): BoardPosition[] => {
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

  public computeDefendedDestination(piece: Piece): BoardPosition[] {
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

  public applyMove = (move: Move): Play => {
    const [newCol, newRow] = move.to;

    const taken = this.getPieceAt(move.to);
    const piece = this.getPieceAt(move.from) as Piece;
    if (taken) this.take(taken.position);
    piece.row = newRow;
    piece.col = newCol;

    return {
      move,
      piece,
      taken
    };
  };

  public basicMove = (move: Move) => {
    const [newCol, newRow] = move.to;

    const piece = this.getPieceAt(move.from) as Piece;
    piece.row = newRow;
    piece.col = newCol;
  };

  public take = (taken: BoardPosition) => {
    this.pieces = this.pieces.filter((piece) => !isSameBox(piece.position, taken));
  };

  public reset = () => {
    this.pieces = PIECES.map((p) => new Piece(p.type, p.color, p.row, p.col));
  };

  public display = () => {
    for (let row = 8; row > 0; row -= 1) {
      let rowText = "";
      for (let col = 1; col < 9; col += 1) {
        const piece = this.getPieceAt([col, row]);
        rowText += piece ? `[${piece.color === PieceColor.White ? "W" : "B"}${piece.type[0]}]` : "[__]";
      }
      console.log(`${row} ${rowText}\n`);
    }
  };
}
