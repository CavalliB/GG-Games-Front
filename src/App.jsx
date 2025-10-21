import { useState } from 'react'
import Principal from './Principal.jsx'
import Nav from './Nav.jsx'
import './App.css'

function App() {
  const [seccion, setSeccion] = useState('principal')

  return (
    <div>
      <nav>
        <Nav setSeccion={setSeccion} />
      </nav>
      <main>
        {seccion === 'principal' && <Principal />}

      </main>
      <footer></footer>
    </div>
  )
}

export default App
