import React from 'react'
import './app.css'
import { Board } from './board'

const INITIAL_BOARD = [
  ['BT', 'BC', 'BF', 'BQ', 'BK', 'BF', 'BC', 'BT'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['WP', 'WP', 'WP', 'WP', '', 'WP', 'WP', 'WP'],
  ['WT', 'WC', 'WF', 'WQ', 'WK', '', 'WC', 'WT']
]

class BoardManager {
  constructor() {
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

class Game {
  constructor() {
    this.board = new BoardManager()

    this.computeMooves()
  }

  computePawnMooves(rowIndex, columnIndex, piece) {
    const inc = piece.color === 'B' ? 1 : -1
    const mooves = [[rowIndex + inc, columnIndex - 1], [rowIndex + inc, columnIndex + 1]].filter(([r, c]) =>
      this.board.isEnnemy(r, c, piece)
    )

    for (let i = 1; i <= 2; i++) {
      const r = rowIndex + i * inc
      const c = columnIndex

      if (this.board.isEmpty(r, c)) {
        mooves.push([r, c])
      } else break
    }

    return mooves
  }

  computeKingMooves(rowIndex, columnIndex, piece) {
    return [
      [rowIndex, columnIndex - 1],
      [rowIndex, columnIndex + 1],
      [rowIndex - 1, columnIndex],
      [rowIndex + 1, columnIndex]
    ].filter(([r, c]) => this.board.isEmpty(r, c) || this.board.isEnnemy(r, c, piece))
  }

  computeMooves() {
    ;[0, 1, 2, 3, 4, 5, 6, 7].forEach((columnIndex) => {
      ;[0, 1, 2, 3, 4, 5, 6, 7].forEach((rowIndex) => {
        const piece = this.board.at(rowIndex, columnIndex)

        if (!piece || !piece.type === 'EMPTY') return []

        let mooves = []
        if (piece.type === 'K') {
          mooves = this.computeKingMooves(rowIndex, columnIndex, piece)
        }
        if (piece.type === 'P') {
          mooves = this.computePawnMooves(rowIndex, columnIndex, piece)
        }

        this.board.setMooves(rowIndex, columnIndex, mooves)
      })
    })
  }

  at(rowIndex, columnIndex) {
    return this.board.at(rowIndex, columnIndex)
  }
}

const App = () => {
  const game = new Game()

  return (
    <div className="layout">
      <Board game={game} />
    </div>
  )
}

export default App
