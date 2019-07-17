import React, { useState } from 'react'
import { Case } from './case'

const Board = (props) => {
  const [selected, setSelected] = useState([])
  const [selectedRow, selectedColunm] = selected

  const selectedPiece = props.game.at(selectedRow, selectedColunm)
  const mooves = (selectedPiece && selectedPiece.mooves) || []

  console.log(selectedPiece)

  return (
    <div className="board">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((row) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((column) => {
          const isSelected = row === selectedRow && column === selectedColunm
          const piece = props.game.at(row, column)

          const handleSelect = () => {
            if (piece.type === 'EMPTY') return

            if (isSelected) setSelected([])
            else setSelected([row, column])
          }

          return (
            <Case
              key={`${row}-${column}`}
              isSelected={isSelected}
              isMoovable={!!mooves.find(([r, c]) => r === row && c === column)}
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
