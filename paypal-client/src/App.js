import './App.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalSdkExample = () => {
  return (
      <PayPalScriptProvider options={{ clientId: "AYPzEXwX0emtTccFnnx_xQv1tQ0PZ3eLWYd174D-OZ0w97DzvtXZ0PTwmD01XXMA0bF5SWoJBnViIVEd" }}>
          <PayPalButtons
              createOrder={(data, actions) => {
                  // This call goes to the paypal (/v2/checkout/orders) and create an order on their side
                  return actions.order.create({
                      purchase_units: [
                          {
                              amount: {
                                  value: "1.63",
                              },
                          },
                      ],
                  });
              }}
              onApprove={(data, actions) => {
                // This call goes to the paypal (/api/orders/:orderID/capture) and capture an order on their side
                // 
                return actions.order.capture().then((details) => {
                      const name = details.payer.name.given_name;
                      console.log('data', data);
                      setTimeout(() =>  alert(`
                      Transaction completed by ${name}
                      see console and Test Here -->> https://www.sandbox.paypal.com/activities/
                      `), 1000)
                     
                  });
              }}
              onError={() => alert(`error`)}
          />
      </PayPalScriptProvider>
  );
}

function App() {
  return (
    <div className="App">
      <PayPalSdkExample/>
    </div>
  );
}

export default App;
