import { PieceColor, Play } from "core/chess";
import { Board } from "core/chess/board";
import { opponentColor } from "core/chess/utils";
import { Position } from "./position";
import { REPORT_TYPE } from "./report";

const positionsContainer: { [k: string]: Position } = {};

const createPosition = (board: Board, play: Play, parentId?: string) => {
  const position = new Position(board, play, parentId);
  positionsContainer[position.id] = position;
  return position;
};

const getPosition = (id: string) => positionsContainer[id];

const computePositions = (initialBoard: Board, color: PieceColor, parentId?: string): Position[] => {
  const newPositions: Position[] = [];
  const pieces = initialBoard.getPieces({ color });

  for (let piece of pieces) {
    const destinations = initialBoard.computePossibleDestinations(piece);
    for (let destination of destinations) {
      const board = Board.copy(initialBoard);
      const play = board.applyMove({ from: piece.position, to: destination });
      const position = createPosition(board, play, parentId);
      position.computePreAnalyse(color);
      if (position.report.is(REPORT_TYPE.forbidden)) continue;

      newPositions.push(position);
    }
  }

  return newPositions;
};

const computeMyPositions = (opponentBoard: Board, color: PieceColor, opponentPositionId?: string): Position[] => {
  const parentBoards: Board[] = [];
  let parentId = opponentPositionId;

  while (parentId) {
    const opponentPosition = getPosition(parentId);
    const myParentPosition = getPosition(opponentPosition.parentId!);
    parentBoards.push(myParentPosition.board);
    parentId = myParentPosition.parentId;
  }

  const positions = computePositions(opponentBoard, color, opponentPositionId).filter(({ board }) => {
    return !parentBoards.some((parentBoard) => parentBoard.equal(board));
  });

  for (let position of positions) {
    if (position.report.is(REPORT_TYPE.check)) {
      position.opponentPositions = computePositions(position.board, opponentColor(color), position.id);
      position.computePostAnalyse();
    }
  }

  return positions;
};

const simulatePosition = (position: Position, color: PieceColor, i: number): Position[] => {
  if (!position.report.postAnalysed()) {
    position.opponentPositions = computePositions(position.board, opponentColor(color));
  }

  const initial: Position[] = [];
  return position.opponentPositions.reduce(
    (acc, opponentPosition) => [...acc, ...computeMyPositions(opponentPosition.board, color, opponentPosition.id)],
    initial
  );
};

const managePosition = (initialPosition: Position) => {
  const matePlays: Play[] = [initialPosition.lastPlay];

  let position = initialPosition;
  while (position.parentId && position.report.is(REPORT_TYPE.checkMate)) {
    const opponentParentPosition = getPosition(position.parentId);
    opponentParentPosition.report.setType(REPORT_TYPE.opponentWillMate, position.report.description);

    const myParentPosition = getPosition(opponentParentPosition.parentId!);
    myParentPosition.recomputePostAnalyse();

    matePlays.unshift(opponentParentPosition.lastPlay);
    matePlays.unshift(myParentPosition.lastPlay);

    position = myParentPosition;
  }

  return position.report.is(REPORT_TYPE.checkMate) ? matePlays : null;
};

export const find = (board: Board, lastPlay: Play): Play[] => {
  const color = opponentColor(lastPlay.piece.color) || PieceColor.White;

  let positions = computeMyPositions(board, color);

  let i = 0;
  while (positions.length && i < 50) {
    positions.sort((m1, m2) => m1.compare(m2));

    const position = positions.shift() as Position;
    // position.display();
    const nextPositions = simulatePosition(position, color, i);

    const matePlays = managePosition(position);
    if (matePlays) return matePlays;

    positions = [...positions, ...nextPositions];
    i += 1;
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
