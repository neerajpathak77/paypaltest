import 'dotenv/config' 
import express from 'express' 
import cors from 'cors'
import * as paypal from './paypal.js' 

const { PORT = 8888, CLIENT_ID: clientId } = process.env

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cors({
  origin: '*',
  optionSuccessStatus: 200,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// render checkout page with client id & unique client token
app.get('/paypal', async (req, res) => {
  try {
    const clientToken = await paypal.generateClientToken()
    res.render('checkout', { clientId, clientToken })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.get('/paypalToken', async (req, res) => {
  try {
    const clientToken = await paypal.generateClientToken()
    res.json({ clientToken })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

// create order
app.post('/api/orders', async (req, res) => {
  try {
    const { amount } = req.body
    const order = await paypal.createOrder( { amount })
    res.json(order)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

// capture payment
app.post('/api/orders/:orderID/capture', async (req, res) => {
  const { orderID } = req.params
  try {
    const captureData = await paypal.capturePayment(orderID)
    res.json(captureData)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/`)
})

// LINK
// 1. https://developer.paypal.com/docs/checkout/advanced/integrate/
