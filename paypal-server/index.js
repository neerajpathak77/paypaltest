import "dotenv/config";
import express from "express";
import ejs from "ejs";
import * as paypal from "./paypal.js";
import { getpaypalHtml } from "./tempHtmlWothoutTemplating.js";


const { PORT = 8888, CLIENT_ID: clientId } = process.env;


const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// render checkout page with client id & unique client token
app.get("/paypal", async (req, res) => {
  try {
    const clientToken = await paypal.generateClientToken();
    res.render("checkout", { clientId, clientToken });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/paypalToken", async (req, res) => {
  try {
    const clientToken = await paypal.generateClientToken();
    res.json({ clientToken });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// create order
app.post("/api/orders", async (req, res) => {
  try {
    const order = await paypal.createOrder();
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  try {
    const captureData = await paypal.capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/`);
});

// LINK
// 1. https://developer.paypal.com/docs/checkout/advanced/integrate/
