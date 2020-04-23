import { Piece } from "./piece";

export enum EPieceColor {
  White = "white",
  Black = "black"
}

export enum EPieceType {
  Pawn = "pawn",
  King = "king",
  Queen = "queen",
  Tower = "tower",
  Knight = "knight",
  Bishop = "bishop"
}

export type Position = [number, number];

export type Move = {
  from: Position;
  to: Position;
};

export type Promotion = {
  from: EPieceType;
  to: EPieceType;
};

export type Play = {
  move: Move;
  rock?: Move;
  taken?: Piece;
  promotion?: Promotion;
};
