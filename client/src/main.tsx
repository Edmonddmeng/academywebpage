import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/barlow-condensed/600.css'
import './index.css'
import App from './App.tsx'
import { LocaleProvider, detectLocale } from './content/locale'

const locale = detectLocale(window.location.pathname)
const basename = locale === 'zh' ? '/zh' : undefined

document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <LocaleProvider locale={locale}>
        <App />
      </LocaleProvider>
    </BrowserRouter>
  </StrictMode>,
)
