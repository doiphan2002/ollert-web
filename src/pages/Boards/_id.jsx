import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sort'
import { Box, CircularProgress, Typography } from '@mui/material'

import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
// import Box from '@mui/material/Box'
// import CircularProgress from '@mui/material/CircularProgress'
// import Typography from '@mui/material/Typography'
// import { toast } from 'react-toastify'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '6666a4e9ec4eeac24e8493f5'
    // Call API
    fetchBoardDetailsAPI(boardId).then(board => {

      // Sort lại thứ tự Column ở đây để đưa data xuống các component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // Xử lí vấn đề drag&drop vào một column rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các compoment con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      setBoard(board)
    })
  }, [])

  // Func này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu State Board
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

  // Func này có nhiệm vụ gọi API tạo mới Card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật lại state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]

      } else {
        // Ngược lại Column đã có data thi push vào cuối mảng
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi API và xử lý khi kéo thả Column xong xuôi
  // Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó (thay đổi vị trí trong board)
  const moveColumns = (dndorderedColumns) => {
    // Update cho chuẩn dữ liệu state Board
    const dndorderedColumnsIds = dndorderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndorderedColumns
    newBoard.columnOrderIds = dndorderedColumnsIds
    setBoard(newBoard)

    // Gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndorderedColumnsIds })
  }

  // Khi di chuyển card trng cùng Column:
  // Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Gọi API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  // Khi di chuyển card sang Column khác:
  // B1: Cập nhật lại mảng cardOrderIds cảu Column ban đầu chứa nó (Nôm na là xóa cái _id của Card ra khỏi mảng)
  // B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Nôm ra là thêm _id của Card vào mảng)
  // B3: Cập nhật lại trường columnId mới của cái Card đã kéo
  // => Làm một API support riêng.
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndorderedColumns) => {
    // Update cho chuẩn dữ liệu state Board
    const dndorderedColumnsIds = dndorderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndorderedColumns
    newBoard.columnOrderIds = dndorderedColumnsIds
    setBoard(newBoard)

    // Gọi API xử lý phía BE
    let prevCardOrderIds = dndorderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds || []
    // Xử lý vấn đề khi kéo Card cuối cùng ra Column, Column rỗng sẽ có placeholder card cần xóa nó đi trước khi gửi dữ lên cho phía BE
    if (prevCardOrderIds[0].includes('-placeholder-card')) prevCardOrderIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndorderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  // Xử lý xóa một Column và Cards bên trong nó
  const deleteColumnDetails = (columnId) => {
    // Update cho chuẩn dữ liệu state board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)

    // Gọi API xử lý phía BE
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })

  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading Board ...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
