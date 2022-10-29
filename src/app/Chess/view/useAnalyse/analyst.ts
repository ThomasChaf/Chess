import { PieceColor, Play } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Move } from "./move";

const computeMoves = (initialBoard: Board, color: PieceColor, path?: Move[]): Move[] => {
  const newMoves: Move[] = [];
  const pieces = initialBoard.getPieces({ color });

  for (let piece of pieces) {
    const destinations = initialBoard.computePossibleDestinations(piece);
    for (let destination of destinations) {
      const board = Board.copy(initialBoard);
      const play = board.applyMove({ from: piece.position, to: destination });
      const move = new Move(board, play, path);
      const forbidden = move.computePreAnalyse(color);
      if (forbidden) continue;

      newMoves.push(move);
    }
  }

  return newMoves;
};

const computeMyMoves = (initialBoard: Board, color: PieceColor, path?: Move[]): Move[] => {
  const moves = computeMoves(initialBoard, color, path);

  for (let move of moves) {
    move.opponentMoves = computeMoves(move.board, opponentColor(color), path);

    move.computePostAnalyse(color);
  }

  return moves;
};

const simulateMove = (move: Move, color: PieceColor): Move[] => {
  // TODO gérer quand le joueur adverse peut faire pleins de coups
  if (move.opponentMoves.length !== 1) return [];

  const opponentMove = move.opponentMoves[0];

  return computeMyMoves(opponentMove.board, color, [...move.path, move]);
};

export const find = (board: Board, lastPlay: Play): Move | undefined => {
  const color = opponentColor(lastPlay.piece.color) || PieceColor.White;

  let moves = computeMyMoves(board, color);

  while (moves.length) {
    moves.sort((m1, m2) => m1.compare(m2));

    const move = moves.shift() as Move;
    if (move.analyse?.checkMate) return move;

    // console.log("==========================================================");
    // console.log(move);
    // console.log(moves);
    // console.log("==========================================================");

    const nextMoves = simulateMove(move, color);

    moves = [...moves, ...nextMoves];
  }

  return undefined;
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
