import React from 'react'
import './app.css'
import { Game } from './modules/game'
import { Board } from './components/board'

const INITIAL_BOARD = [
  ['BT', 'BC', 'BB', 'BQ', 'BK', 'BB', 'BC', 'BT'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['WP', 'WP', 'WP', 'WP', '', 'WP', 'WP', 'WP'],
  ['WT', 'WC', 'WB', 'WQ', 'WK', 'WB', 'WC', 'WT']
]

const App = () => {
  const game = new Game(INITIAL_BOARD)

  return (
    <div className="layout">
      <Board game={game} />
    </div>
  )
}

export default App
