import './App.css'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

const PayPalSdkExample = () => {
  return (
      <PayPalScriptProvider options={{ clientId: "AYPzEXwX0emtTccFnnx_xQv1tQ0PZ3eLWYd174D-OZ0w97DzvtXZ0PTwmD01XXMA0bF5SWoJBnViIVEd" }}>
          <PayPalButtons
              createOrder={(data, actions) => {
                  // call our own end point to create and order and return and order id from here
                  return fetch("http://localhost:9000/api/orders", {
                    method: "post",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      amount: 6.66,
                    }),
                  })
                    .then((response) => response.json())
                    .then((order) => order.id)
              }}
              onApprove={(data, actions) => {
                // Ask your own end point to capture the money
                return fetch(`http://localhost:9000/api/orders/${data.orderID}/capture`, {
                  method: "post",
                })
                  .then((response) => response.json())
                  .then((orderData) => {
                    console.log(
                      "Capture result",
                      orderData,
                      JSON.stringify(orderData, null, 2)
                    )
                    const transaction = orderData.purchase_units[0].payments.captures[0]
                    setTimeout(() =>{
                      alert(`Transaction ${transaction.status}: ${transaction.id}
                      See console for all available details
                    `)
                    }, 1000)
                  })
              }}
              onError={() => alert(`error`)}
          />
      </PayPalScriptProvider>
  )
}

function App() {
  return (
    <div className="App">
      <PayPalSdkExample/>
    </div>
  )
}

export default App
