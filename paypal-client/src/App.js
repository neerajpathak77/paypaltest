import logo from './logo.svg';
import './App.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useEffect, useState } from 'react'

const PayPalSdkExample = () => {
  return (
      <PayPalScriptProvider options={{ clientId: "AYPzEXwX0emtTccFnnx_xQv1tQ0PZ3eLWYd174D-OZ0w97DzvtXZ0PTwmD01XXMA0bF5SWoJBnViIVEd" }}>
          <PayPalButtons
              createOrder={(data, actions) => {
                  // Here call the node js endpoint
                  return actions.order.create({
                      purchase_units: [
                          {
                              amount: {
                                  value: "1.99",
                              },
                          },
                      ],
                  });
              }}
              onApprove={(data, actions) => {
                // Here call the node js endpoint. This is actual finilization
                  return actions.order.capture().then((details) => {
                      const name = details.payer.name.given_name;
                      alert(`Transaction completed by ${name}`);
                  });
              }}
          />
      </PayPalScriptProvider>
  );
}

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
      <PayPalSdkExample/>
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
