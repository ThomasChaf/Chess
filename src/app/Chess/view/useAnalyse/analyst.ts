import { PieceColor, Play } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Move } from "./move";

export class Analyst {
  findBestMove(moves: Move[]): Move | undefined {
    if (!moves) return;
    return moves.filter((move: Move) => move.analyse?.checkMate)[0];
  }

  // if (moves) {
  //   for (let move of moves) {
  //     const { board } = move;
  //     const opp = this.computeMoves(board, opponentColor(color), depth - 1, move.opponentMoves);
  //     if (!move.opponentMoves) {
  //       move.opponentMoves = opp;
  //     }
  //     move.computePostAnalyse(color);
  //     if (move.analyse?.checkMate) return null;
  //   }
  //   return null;
  // }

  computeMoves(initialBoard: Board, color: PieceColor): Move[] {
    const newMoves: Move[] = [];
    const pieces = initialBoard.getPieces({ color });

    for (let piece of pieces) {
      const destinations = initialBoard.computePossibleDestinations(piece);
      for (let destination of destinations) {
        const board = Board.copy(initialBoard);
        const play = board.applyMove({ from: piece.position, to: destination });
        const move = new Move(board, play);
        const forbidden = move.computePreAnalyse(color);
        if (forbidden) continue;

        newMoves.push(move);
      }
    }

    return newMoves;
  }

  computeMyMoves(initialBoard: Board, color: PieceColor): Move[] {
    const moves = this.computeMoves(initialBoard, color);

    for (let move of moves) {
      move.opponentMoves = this.computeMoves(move.board, opponentColor(color));

      move.computePostAnalyse(color);
    }

    return moves;
  }

  static find(board: Board, lastPlay: Play): Move | undefined {
    const analyst = new Analyst();

    console.log(lastPlay);

    const color = opponentColor(lastPlay.piece.color) || PieceColor.White;

    const moves = analyst.computeMyMoves(board, color);

    console.log(moves);

    // let depth = 1;
    // while (depth < 5) {
    //   analyst.computeMyMoves(board, color);

    //   const checkMove = analyst.findBestMove(moves);
    //   if (checkMove) return checkMove;

    //   depth++;
    // }

    return undefined;
  }
}

// newMoves.sort((m1, m2) => m1.compare(m2));
// if (newMoves[0]?.analyse?.checkMate) {
//   newMoves = [newMoves[0]];
// }

// if (newMoves.length === 1 && depth === 1) {
//   const forcedMove = newMoves[0];
//   forcedMove.opponentMoves = this.computeMoves(forcedMove.board, opponentColor(color), depth + 1, null);
//   forcedMove.computePostAnalyse(color);
// }

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
