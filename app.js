const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

const listController = require("./controller/list");
const userController = require("./controller/user");
const itemController = require("./controller/item");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/list", listController);
app.use("/user", userController);
app.use("/item", itemController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
