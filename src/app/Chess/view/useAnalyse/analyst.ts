import { PieceColor, Play } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Position } from "./position";

const computePositions = (initialBoard: Board, color: PieceColor, path?: Position[]): Position[] => {
  const newPositions: Position[] = [];
  const pieces = initialBoard.getPieces({ color });

  for (let piece of pieces) {
    const destinations = initialBoard.computePossibleDestinations(piece);
    for (let destination of destinations) {
      const board = Board.copy(initialBoard);
      const play = board.applyMove({ from: piece.position, to: destination });
      const position = new Position(board, play, path);
      const forbidden = position.computePreAnalyse(color);
      if (forbidden) continue;

      newPositions.push(position);
    }
  }

  return newPositions;
};

const computeMyPositions = (initialBoard: Board, color: PieceColor, path?: Position[]): Position[] => {
  const positions = computePositions(initialBoard, color, path);

  for (let position of positions) {
    position.opponentPositions = computePositions(position.board, opponentColor(color), path);

    position.computePostAnalyse(color);
  }

  return positions;
};

const simulatePosition = (position: Position, color: PieceColor): Position[] => {
  // TODO gérer quand le joueur adverse peut faire pleins de coups
  if (position.opponentPositions.length !== 1) return [];

  const opponentPosition = position.opponentPositions[0];

  return computeMyPositions(opponentPosition.board, color, [...position.path, position]);
};

export const find = (board: Board, lastPlay: Play): Play[] => {
  const color = opponentColor(lastPlay.piece.color) || PieceColor.White;

  let positions = computeMyPositions(board, color);

  while (positions.length) {
    positions.sort((m1, m2) => m1.compare(m2));

    const position = positions.shift() as Position;
    if (position.analyse?.checkMate) {
      console.log("============= FINAL RESULT: =============");
      position.display();
      console.log("=========================================");
      const results: Play[] = [];

      position.path.forEach(({ lastPlay, opponentPositions }) => {
        results.push(lastPlay);
        results.push(opponentPositions[0].lastPlay);
      });
      results.push(position.lastPlay);

      return results;
    }

    // console.log("==========================================================");
    // console.log(move);
    // console.log(moves);
    // console.log("==========================================================");

    const nextPositions = simulatePosition(position, color);

    positions = [...positions, ...nextPositions];
  }

  return [];
};

// Idée algos

// 1) Je calcule mes moves de base

// 2) Je fais une pile de move a analyser je rajoute des move dedans a chaque fois

// 3) Pour chaque move il me faut les move adversaire
// => mais pour les moves adverses il me faut encore les moves adverses

// 4) C'est un algo qui peut etre evolutif car au bout d'un moment on mets dans la pile palier par palier
// => mais d'abord on est efficace on va chercher les mats

// 5) Il va peut etre me falloir mettre les moves de base dans un object avec un id comme ca quand je descends
// je descends l'id sur chaque move comme une sorte de pointeur vers le move initial car si a la fin j'ai un bon
// move il me faut pouvoir l'associer avec le move initial

// 6) Si je trouve mat en 3 il me faut check toutes les combinaisons de 2 pour être sur que je n'oublie pas un mat en 2
// => ca veut dire qu'il me faut la profondeur d'un coup
