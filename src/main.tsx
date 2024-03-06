import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from '@/App.tsx'

// global styles
import '@/globals.css'

// custom providers
import ThemeProvider from '@/services/providers/theme/ThemeProvider.tsx'
import APIProvider from '@/services/providers/api/APIProvider.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <APIProvider type="storage">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </APIProvider>
    </ThemeProvider>
  </React.StrictMode>
)
