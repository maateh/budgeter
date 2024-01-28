import React from 'react'
import ReactDOM from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App.tsx'
import './globals.css'

import ThemeProvider from '@/components/theme/ThemeProvider.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <App /> 
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)
