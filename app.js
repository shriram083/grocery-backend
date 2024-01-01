const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Grocery Item Model
const groceryItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
});

const GroceryItem = mongoose.model("GroceryItem", groceryItemSchema);

app.get("/", (req, res) => {
  console.log("here -->");
  res.send("Hello, World!");
});

// Routes
app.post("/api/grocery", (req, res) => {
  const { name, quantity } = req.body;

  if (!name || !quantity) {
    return res.status(400).json({ error: "Name and quantity are required" });
  }

  const newItem = new GroceryItem({ name, quantity });

  newItem
    .save()
    .then(() => res.json({ message: "Item added to the inventory" }))
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message })
    );
});

app.get("/api/grocery", (req, res) => {
  GroceryItem.find()
    .then((items) => res.json(items))
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message })
    );
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
