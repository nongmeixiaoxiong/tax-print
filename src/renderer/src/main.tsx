import './assets/main.scss'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { DataProvider } from './contexts/DataContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </StrictMode>
)
