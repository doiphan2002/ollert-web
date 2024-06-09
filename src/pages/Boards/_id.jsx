import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sort'

import { mockData } from '~/apis/mock-data'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI
  // updateBoardDetailsAPI,
  // updateColumnDetailsAPI,
  // moveCardToDifferentColumnAPI,
  // deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '66628accf9e8aef9c61ba7ba'
    // Call API
    fetchBoardDetailsAPI(boardId).then(board => {

      // Sort lại thứ tự Column ở đây để đưa data xuống các component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // Xử lí vấn đề drag&drop vào một column rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })

      setBoard(board)
    })
  }, [])

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật lại state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật lại state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)

    }
    setBoard(newBoard)
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        // moveColumns={moveColumns}
        // moveCardInTheSameColumn={moveCardInTheSameColumn}
        // moveCardToDifferentColumn={moveCardToDifferentColumn}
        // deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
