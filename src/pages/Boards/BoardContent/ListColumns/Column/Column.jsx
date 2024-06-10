import { useState } from 'react'
import { toast } from 'react-toastify'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useConfirm } from 'material-ui-confirm'

function Column({ column, createNewCard, deleteColumnDetails }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    //touchAction: 'none', // Dành cho sensor default dạng PointerSensor
    // Nếu sử dụng CSS.Transform như docs thì sẽ bị lỗi kiểu stretch
    transform: CSS.Translate.toString(transform),
    transition,
    /* Chiều cao phải luôn max 100% vì nếu không sẽ lỗi lúc kéo column ngắn qua một cái column dài thì phải kéo
    ở khu vực giữa giữa rất khó chịu (demo ở vid 32). Lưu ý lúc này phải kết hợp với {...listeners} nằm ở Box
    chứ không phải ở div ngoài cùng để tránh trường hợp kéo vào vùng xanh. */
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  // Columns đã được sort ở component cha cao nhất
  const orderedCard = column.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error(' Please enter Card title!', { position: 'bottom-right' })
      return
    }

    // Tạo dữ liệu Column để call API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    // Gọi API ở đây..
    createNewCard(newCardData)

    // Đóng trạng thái thêm Card mới & clear input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  // Xoá 1 Columns và Cards bên trong nó
  // const confirmDeleteColumn = useConfirm()
  // const handleDeleteColumn = () => {
  //   confirmDeleteColumn({
  //     title: 'Delete Column !?',
  //     description: 'This action will permanently delete this Column and all Cards inside it. Are you sure?',
  //     confirmationText: 'Yes, delete it!',
  //     cancellationText: 'No, keep it'
  //     // buttonOrder: ['confirm', 'cancel']
  //     // allowClose: false,
  //     // dialogProps: { maxWidth: 'xs' },
  //     // cancellationButtonProps: { color: 'primary' },
  //     // confirmationButtonProps: { color: 'error', variant: 'outlined' },
  //     // description: 'Hãy chấp nhận sự thật rằng minatdeptrai để đươc xác nhận xoá Column này!',
  //     // confirmationKeyword: 'minatdeptrai'
  //   }).then(() => {
  //     deleteColumnDetails(column._id)
  //   }).catch(() => {})
  // }

  // Xoá 1 Columns và Cards bên trong nó
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete Column?',
      description: 'This action will permanetly delete your Column and its Cards! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
      // buttonOrder: ['confirm', 'cancel']
      // allowClose: false,
      // dialogActionsProps: { maxWidth: 'xs' },
      // confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
      // cancellationButtonProps: { color: 'inherit' },
      // description: 'Bạn có chắc chắn doiphandev để xóa Column này hay không?',
      // confirmationKeyword: 'doiphandev',
    }).then(() => {
      deleteColumnDetails(column._id)
    }).catch(() => {})
  }

  // Phải bọc div ở đây vì vấn đề chiều cao của column khi kéo thả sẽ có bug kiểu kiểu flickering
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: theme => theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: theme => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>
        {/* Box Column Header */}
        <Box sx={{
          height: theme => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant='h6' sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title='More options'>
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id='basic-column-dropdown'
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id='basic-menu-column-dropdown'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{ '&:hover': { color: 'success.light', '& .add-card-icon': { color: 'success.light' } } }}
              >
                <ListItemIcon><AddCardIcon className='add-card-icon' fontSize='small' /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
                <Typography variant='body2' color='text.secondary'>⌘X</Typography>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize='small' /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
                <Typography variant='body2' color='text.secondary'>⌘X</Typography>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopyIcon fontSize='small' /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
                <Typography variant='body2' color='text.secondary'>⌘C</Typography>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPasteIcon fontSize='small' /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
                <Typography variant='body2' color='text.secondary'>⌘V</Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{ '&:hover': { color: 'warning.dark', '& .delete-forever-icon': { color: 'warning.dark' } } }}
              >
                <ListItemIcon><RemoveCircleIcon className='delete-forever-icon' fontSize='small'/></ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><Cloud fontSize='small'/></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* List Cards */}
        <ListCards cards={orderedCard}/>

        {/* Box Column Footer */}
        <Box sx={{
          height: theme => theme.trello.columnFooterHeight,
          p: 2
        }}>
          {!openNewCardForm
            ? <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
            :<Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label='Enter card title..'
                type='text'
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd='true'
                value={newCardTitle}
                onChange={e => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: theme => theme.palette.primary.main,
                    bgcolor: theme => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: theme => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: theme => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: theme => theme.palette.primary.main },
                    '&:Mui-focused fieldset': { borderColor: theme => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  data-no-dnd='true'
                  onClick={addNewCard}
                  variant='contained' color='success' size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: theme => theme.palette.success.main,
                    '&:hover': { bgcolor: theme => theme.palette.success.main }
                  }}
                >Add</Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: theme => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column
