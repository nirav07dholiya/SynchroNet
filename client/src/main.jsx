import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import useAppStore from './store'

createRoot(document.getElementById('root')).render(
  <>
      <App />
    <Toaster richColors closeButton />
  </>
)

// npm install; npm run build; npm install framer-motion; npm install react-intersection-observer; npm install react-player;
