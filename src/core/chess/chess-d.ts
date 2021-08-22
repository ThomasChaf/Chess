import { Piece } from "./piece";

export enum PieceColor {
  White = "white",
  Black = "black"
}

export enum PieceType {
  Pawn = "pawn",
  King = "king",
  Queen = "queen",
  Tower = "tower",
  Knight = "cavalier",
  Bishop = "bishop"
}

export type Position = [number, number];

export type Move = {
  from: Position;
  to: Position;
};

export type Promotion = {
  from: PieceType;
  to: PieceType;
};

export type Play = {
  move: Move;
  piece: Piece;
  rock?: Move;
  taken?: Piece;
  promotion?: Promotion;
};
