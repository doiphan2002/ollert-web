import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SecurityIcon from '@mui/icons-material/Security'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip, Button } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  // const { board } = props

  return (
    <Box sx={{ //Board Bar
      width: '100%',
      height: theme => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflow: 'auto',
      bgcolor: theme => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLE}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable //onClick={() => {}}: cách này cũng được, thấy cũng hay =)))
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLE}
          icon={<SecurityIcon />}
          // label={board?.type === 'public' ? 'Public' : 'Private'} - cái này trick lỏ =)))
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label='Add To Google Drive'
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label='Automation'
          clickable //onClick={() => {}}: cách này cũng được, thấy cũng hay =)))
        />
        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label='Filter'
          clickable //onClick={() => {}}: cách này cũng được, thấy cũng hay =)))
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '10px', //[mode:off] - anhQuân có, còn mình k có =)))
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none', //[1]
              // borderWidth: '1.5px', //[mode:tự thêm =))]
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title='doiphan'>
            <Avatar
              alt='doiphan'
              src='https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/275367768_1461954760914779_2105340831232289498_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=yZ3YSmTRBHEAX9yPrwu&_nc_ht=scontent.fhan3-3.fna&oh=00_AfAI2Tz3Yg92sHhBB3sZYuY0MEFmAxxo2NCYczukCOxawA&oe=660AC9CF'
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
