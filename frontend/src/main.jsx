import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// Catch unhandled promise rejections (network errors etc.)
window.addEventListener('unhandledrejection', (event) => {
  console.warn('[SecureHome] Unhandled rejection:', event.reason)
  // Don't let it crash the app
  event.preventDefault()
})

const rootElement = document.getElementById('root')

if (!rootElement) {
  document.body.innerHTML = '<div style="color:red;padding:2rem;font-family:monospace">ERROR: #root element not found</div>'
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
