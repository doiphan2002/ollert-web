// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'

//* Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Config ConfirmProvider
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <ConfirmProvider defaultOptions={{
      allowClose: false,
      dialogActionsProps: { maxWidth: 'xs' },
      buttonOrder: ['confirm', 'cancel'],
      confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
      cancellationButtonProps: { color: 'inherit' }

    }}>
      <CssBaseline />
      <App />
      <ToastContainer position='bottom-left' theme='colored' autoClose={1000} />
    </ConfirmProvider>
  </CssVarsProvider>
  // </React.StrictMode>
)
