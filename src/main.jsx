import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// App.jsx の場所を components フォルダ内に更新します
import App from './components/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
