import { useState } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'

function Profiles() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Tooltip title='doiphan'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}

        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt='doiphan'
            src='https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/275367768_1461954760914779_2105340831232289498_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=yZ3YSmTRBHEAX9yPrwu&_nc_ht=scontent.fhan3-3.fna&oh=00_AfAI2Tz3Yg92sHhBB3sZYuY0MEFmAxxo2NCYczukCOxawA&oe=660AC9CF'
          />
        </IconButton>
      </Tooltip>

      <Menu
        id='basic-menu-profiles'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        <MenuItem>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} alt='doiphan' src='https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/275367768_1461954760914779_2105340831232289498_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=yZ3YSmTRBHEAX9yPrwu&_nc_ht=scontent.fhan3-3.fna&oh=00_AfAI2Tz3Yg92sHhBB3sZYuY0MEFmAxxo2NCYczukCOxawA&oe=660AC9CF'/> Profile
        </MenuItem>
        <MenuItem>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} alt='doiphan' src='https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/275367768_1461954760914779_2105340831232289498_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=yZ3YSmTRBHEAX9yPrwu&_nc_ht=scontent.fhan3-3.fna&oh=00_AfAI2Tz3Yg92sHhBB3sZYuY0MEFmAxxo2NCYczukCOxawA&oe=660AC9CF' /> My account
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles