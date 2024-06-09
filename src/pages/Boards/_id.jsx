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
  createNewCardAPI,
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

      // board.columns.forEach(column => {
      //   // Xử lí vấn đề drag&drop vào một column rỗng
      //   if (isEmpty(column.cards)) {
      //     column.cards = [generatePlaceholderCard(column)]
      //     column.cardOrderIds = [generatePlaceholderCard(column)._id]
      //   } else {
      //     // Sort lại thứ tự Column ở đây để đưa data xuống các component con
      //     column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
      //   }
      // })
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

    // // Cập nhật lại state board
    // const newBoard = { ...board }
    // newBoard.columns.push(createdColumn)
    // newBoard.columnOrderIds.push(createdColumn._id)
    // setBoard(newBoard)
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
      // Nếu Column rỗng: bản chất là đang chứa mốt cái placeholder card
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }

    }
    setBoard(newBoard)
  }

  // //! Func này có nhiệm vụ tạo API và xử lí kéo thả khi xong xuôi
  // const moveColumns = (dndOrderedColumns) => {
  //   // Update lại cho chuẩn data state Board
  //   const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

  //   const newBoard = { ...board }
  //   newBoard.columns = dndOrderedColumns
  //   newBoard.columnOrderIds = dndOrderedColumnsIds
  //   setBoard(newBoard)

  //   // Call API update Board
  //   updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  // }

  //! Khi move Card trong cùng 1 Column, chỉ cần call API update CardOrderIds
  // const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
  //   // Update lại cho chuẩn data state Board
  //   const newBoard = { ...board }
  //   const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
  //   if (columnToUpdate) {
  //     columnToUpdate.cards = dndOrderedCards
  //     columnToUpdate.cardOrderIds = dndOrderedCardIds
  //   }
  //   setBoard(newBoard)
  //   // Call API update Column
  //   updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  // }

  // const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
  //   // Update lại cho chuẩn data state Board
  //   const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
  //   const newBoard = { ...board }
  //   newBoard.columns = dndOrderedColumns
  //   newBoard.columnOrderIds = dndOrderedColumnsIds
  //   setBoard(newBoard)

  //   // Call API update Board
  //   let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
  //   //! Xử lí case kéo phần tử cuối cùng(Card - có chứa 'placeholder-card') ra khỏi Column
  //   if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

  //   moveCardToDifferentColumnAPI({
  //     currentCardId,
  //     prevColumnId,
  //     prevCardOrderIds,
  //     nextColumnId,
  //     nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
  //   })
  // }

  // Xó một Column và Card bên trong nó
  // const deleteColumnDetails = (columnId) => {
  //   // Update cho chuẩn dữ liệu state Board
  //   const newBoard = { ...board }
  //   newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
  //   newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
  //   setBoard(newBoard)

  //   // Gọi API xử lí BE
  //   deleteColumnDetailsAPI(columnId).then(res => {
  //     toast.success(res?.deleteResult)
  //   })
  // }

  // if (!board) {
  //   return (
  //     <Box sx={{
  //       display: 'flex',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       gap: 2,
  //       width: '100vw',
  //       height: '100vh'
  //     }}>
  //       <CircularProgress />
  //       <Typography>Loading Board..</Typography>
  //     </Box>
  //   )
  // }

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
