import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './components/ThemeContext.jsx' // Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the App component */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)