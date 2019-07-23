import React, { useState } from 'react'
import { Case } from './case'

const isPieceMoovable = (selectedPiece, row, column) => {
  if (!selectedPiece || selectedPiece.type === 'EMPTY') return false

  return !!selectedPiece.mooves.find(([r, c]) => r === row && c === column)
}

const Board = (props) => {
  const [selected, setSelected] = useState([])
  const [m, setMoove] = useState(0)
  const [selectedRow, selectedColunm] = selected

  const selectedPiece = props.game.board.at(selectedRow, selectedColunm)
  const situation = props.game.situation

  return (
    <div className="board">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((row) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((column) => {
          const isSelected = row === selectedRow && column === selectedColunm
          const isMoovable = isPieceMoovable(selectedPiece, row, column)
          const piece = props.game.board.at(row, column)

          const handleSelect = () => {
            if (isMoovable) {
              props.game.moove(selectedPiece, row, column)
              setMoove(m + 1)
              setSelected([])
              return
            }

            if (piece.type === 'EMPTY') return

            if (isSelected) setSelected([])
            else setSelected([row, column])
          }

          return (
            <Case
              key={`${row}-${column}`}
              isSelected={isSelected}
              isMoovable={isMoovable}
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
