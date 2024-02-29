import React from 'react'
import ReactDOM from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App.tsx'
import './globals.css'

import ThemeProvider from '@/services/providers/theme/ThemeProvider.tsx'
import APIProvider from '@/services/providers/api/APIProvider.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <APIProvider type="storage">
        <QueryClientProvider client={queryClient}>
          <App /> 
        </QueryClientProvider>
      </APIProvider>
    </ThemeProvider>
  </React.StrictMode>
)
