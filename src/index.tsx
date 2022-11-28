import React from 'react'
import ReactDOM from 'react-dom/client'
import './host'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'

async function main() {
  if (process.env.NODE_ENV === 'development') {
    // const {worker} = require('./mocks/browser')
    // await worker.start()
    // console.log('worker started')
  }

  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

main()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
