import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react'

function App() {

  const [payPalButton, setPayPalButton] = useState('')

  useEffect(()=>{
    const renderButtons = async () => {
      const res = await fetch('http://localhost:9000/paypal')
      const html = await res.text()
      setPayPalButton(html)
    }
    renderButtons()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {!!payPalButton && <div dangerouslySetInnerHTML={{ __html: payPalButton }} />}
      </header>
    </div>
  );
}

export default App;
