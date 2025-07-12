
import ReactDOM from 'react-dom/client'
import React,{useState} from "react";
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './ThemeContext.jsx';

const queryClient= new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider >
      <App />
    </ThemeProvider>
  </QueryClientProvider>
    </BrowserRouter>
)
