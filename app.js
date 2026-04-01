const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
  .connect("mongodb://127.0.0.1:27017/inventory_db")
  .then(() => console.log("Connected MongoDB"))
  .catch((err) => console.log(err));

const inventoryRoutes = require("./routes/inventory.routes");
app.use("/inventory", inventoryRoutes);
const productRoutes = require("./routes/product.routes");
app.use("/products", productRoutes);
const messageRoutes = require("./routes/message.routes");
app.use("/messages", messageRoutes);
const userRoutes = require("./routes/user.routes");
app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
