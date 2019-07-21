export class BoardManager {
  constructor(INITIAL_BOARD) {
    this.board = INITIAL_BOARD.map((row) =>
      row.map((cell) => {
        if (!cell) return { type: 'EMPTY' }

        const [color, type] = cell

        return { color, type }
      })
    )
  }

  setMooves(row, column, mooves) {
    this.board[row][column].mooves = mooves
  }

  isEnnemy(row, column, piece) {
    const cell = this.at(row, column)
    return cell && (cell.type !== 'EMPTY' && cell.color !== piece.color)
  }

  isEmpty(row, column) {
    const cell = this.at(row, column)
    return cell && cell.type === 'EMPTY'
  }

  at(row, column) {
    if (row >= 0 && row <= 7 && column >= 0 && column <= 7) return this.board[row][column]

    return null
  }
}
