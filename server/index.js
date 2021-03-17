require("dotenv").config();
const express = require("express");
const cors = require("cors");

const router = require("./routes");
const db = require("./database");

const PORT = 1000;

const app = express();

app.use(express.json());
app.use(cors());

db.connect((err) => {
  if (err) return console.log(err);

  console.log(`database connected: ${db.threadId}`);
});

const {productRouter, userRouter,cartRouter}=require("./routes")
app.use("/product",productRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);

app.listen(PORT, () => console.log("Listening on port:", PORT));
