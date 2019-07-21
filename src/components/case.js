import React from 'react'
import cn from 'classnames'

const Case = (props) => (
  <div className={cn('case', { selected: props.isSelected, moovable: props.isMoovable })} onClick={props.onSelect}>
    Case {props.row} {props.column} {props.value}
  </div>
)

export { Case }
