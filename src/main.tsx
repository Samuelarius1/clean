import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App'
import './styles/global.css'
import './styles/admin.css'
import './styles/customer.css'
import './styles/admin-platform.css'
import './styles/public-content.css'

const theme = createTheme({
  palette: { primary: { main: '#052361' }, secondary: { main: '#E923DA' }, background: { default: '#FFFFFF', paper: '#FFFFFF' }, text: { primary: '#17243B', secondary: '#68758B' } },
  typography: { fontFamily: 'DM Sans, sans-serif', button: { textTransform: 'none', fontWeight: 700 } },
  shape: { borderRadius: 14 },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}><CssBaseline /><BrowserRouter><App /></BrowserRouter></ThemeProvider>
  </React.StrictMode>,
)
