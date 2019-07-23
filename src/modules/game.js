import { BoardManager } from './board-manager'
import { computeMoove } from './mooves'
import { analyseMooves } from './situation'

export class Game {
  constructor(INITIAL_BOARD) {
    this.board = new BoardManager(INITIAL_BOARD)
    this.situtation = { type: 'NEUTRAL' }
    this.computeMooves()
  }

  moove(piece, row, column) {
    this.board.setPiece({ type: 'EMPTY' }, piece.row, piece.column)
    this.board.setPiece(piece, row, column)
    this.computeMooves()
  }

  computeMooves() {
    ;[0, 1, 2, 3, 4, 5, 6, 7].forEach((columnIndex) => {
      ;[0, 1, 2, 3, 4, 5, 6, 7].forEach((rowIndex) => {
        const piece = this.board.at(rowIndex, columnIndex)

        if (!piece || piece.type === 'EMPTY') return

        const mooves = computeMoove(this.board, piece, rowIndex, columnIndex)

        const { isCheck, params } = analyseMooves(this.board, mooves)

        if (isCheck) {
          this.situation = { type: 'CHECK', ...params }
        }

        this.board.setMooves(rowIndex, columnIndex, mooves)
      })
    })
  }
}
