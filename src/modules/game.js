import { BoardManager } from './board-manager'
import { computeMoove } from './mooves'

export class Game {
  constructor(INITIAL_BOARD) {
    this.board = new BoardManager(INITIAL_BOARD)

    this.computeMooves()
  }

  computeMooves() {
    ;[0, 1, 2, 3, 4, 5, 6, 7].forEach((columnIndex) => {
      ;[0, 1, 2, 3, 4, 5, 6, 7].forEach((rowIndex) => {
        const piece = this.board.at(rowIndex, columnIndex)

        if (!piece || piece.type === 'EMPTY') return

        const mooves = computeMoove(this.board, piece, rowIndex, columnIndex)

        this.board.setMooves(rowIndex, columnIndex, mooves)
      })
    })
  }
}
