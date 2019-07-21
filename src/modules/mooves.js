const computeStraightMooves = (board, rowIndex, columnIndex, piece, incR, incC) => {
  const mooves = []

  for (let i = 1; i <= 7; i++) {
    const r = rowIndex + i * incR
    const c = columnIndex + i * incC

    if (board.isEmpty(r, c)) {
      mooves.push([r, c])
    } else if (board.isEnnemy(r, c, piece)) {
      mooves.push([r, c])
      break
    } else break
  }

  return mooves
}

const computeBishopMooves = (board, rowIndex, columnIndex, piece) => {
  return [
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, -1, -1),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, -1, 1),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, 1, -1),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, 1, 1)
  ]
}

const computeTowerMooves = (board, rowIndex, columnIndex, piece) => {
  return [
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, -1, 0),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, 1, 0),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, 0, -1),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, 0, 1)
  ]
}

const computeQueenMooves = (board, rowIndex, columnIndex, piece) => {
  return [
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, -1, -1),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, -1, 0),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, 0, -1),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, -1, 1),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, 1, -1),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, 1, 0),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, 0, 1),
    ...computeStraightMooves(board, rowIndex, columnIndex, piece, 1, 1)
  ]
}

const computeKingMooves = (board, rowIndex, columnIndex, piece) => {
  return [
    [rowIndex, columnIndex - 1],
    [rowIndex, columnIndex + 1],
    [rowIndex - 1, columnIndex],
    [rowIndex + 1, columnIndex]
  ].filter(([r, c]) => board.isEmpty(r, c) || board.isEnnemy(r, c, piece))
}

const computeKnightMooves = (board, rowIndex, columnIndex, piece) => {
  return [
    [rowIndex + 2, columnIndex + 1],
    [rowIndex + 2, columnIndex - 1],
    [rowIndex - 2, columnIndex + 1],
    [rowIndex - 2, columnIndex - 1],
    [rowIndex - 1, columnIndex + 2],
    [rowIndex - 1, columnIndex - 2],
    [rowIndex + 1, columnIndex + 2],
    [rowIndex + 1, columnIndex - 2]
  ].filter(([r, c]) => board.isEmpty(r, c) || board.isEnnemy(r, c, piece))
}

const computePawnMooves = (board, rowIndex, columnIndex, piece) => {
  const inc = piece.color === 'B' ? 1 : -1
  const mooves = [[rowIndex + inc, columnIndex - 1], [rowIndex + inc, columnIndex + 1]].filter(([r, c]) =>
    board.isEnnemy(r, c, piece)
  )

  const max = (piece.color === 'W' && rowIndex === 6) || (piece.color === 'B' && rowIndex === 1) ? 2 : 1

  for (let i = 1; i <= max; i++) {
    const r = rowIndex + i * inc
    const c = columnIndex

    if (board.isEmpty(r, c)) {
      mooves.push([r, c])
    } else break
  }

  return mooves
}

const MOOVES = {
  K: computeKingMooves,
  Q: computeQueenMooves,
  P: computePawnMooves,
  T: computeTowerMooves,
  B: computeBishopMooves,
  C: computeKnightMooves
}

export const computeMoove = (board, piece, rowIndex, columnIndex) =>
  MOOVES[piece.type](board, rowIndex, columnIndex, piece)
