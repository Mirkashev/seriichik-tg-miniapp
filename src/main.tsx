import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './app/providers/QueryProvider'
import { TelegramProvider } from './app/providers/TelegramProvider'
import { router } from './app/router/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TelegramProvider>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </TelegramProvider>
  </StrictMode>,
)
