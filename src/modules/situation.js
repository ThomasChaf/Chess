export const analyseMooves = (board, mooves) => {
  const conclusion = {
    isCheck: false
  }

  mooves.forEach(([row, column]) => {
    if (board.isType(row, column, 'K')) {
      conclusion.isCheck = true
      conclusion.params = {
        position: [row, column]
      }
    }
  })

  return conclusion
}
