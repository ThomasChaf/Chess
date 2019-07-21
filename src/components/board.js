import React, { useState } from 'react'
import { Case } from './case'

const isMoovable = (selectedPiece, row, column) => {
  if (!selectedPiece || selectedPiece.type === 'EMPTY') return false

  return !!selectedPiece.mooves.find(([r, c]) => r === row && c === column)
}

const Board = (props) => {
  const [selected, setSelected] = useState([])
  const [selectedRow, selectedColunm] = selected

  const selectedPiece = props.game.board.at(selectedRow, selectedColunm)

  return (
    <div className="board">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((row) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((column) => {
          const isSelected = row === selectedRow && column === selectedColunm
          const piece = props.game.board.at(row, column)

          const handleSelect = () => {
            if (piece.type === 'EMPTY') return

            if (isSelected) setSelected([])
            else setSelected([row, column])
          }

          return (
            <Case
              key={`${row}-${column}`}
              isSelected={isSelected}
              isMoovable={isMoovable(selectedPiece, row, column)}
              column={column}
              row={row}
              value={piece.type}
              onSelect={handleSelect}
            />
          )
        })
      )}
    </div>
  )
}

export { Board }
