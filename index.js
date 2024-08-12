require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Port = process.env.PORT || 3002;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
});

// Define the Flashcard model
const flashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

app.post("/adminlogin", (req, res) => {
  const { username, password } = req.body;

  // Hardcoded admin credentials (for demonstration purposes)
  const adminUsername = process.env.ADMINUSERNAME;
  const adminPassword = process.env.ADMINPASSWORD;

  // Check if the provided credentials match the admin credentials
  if (username === adminUsername && password === adminPassword) {
    res.send({ success: true, message: "Login successful" });
  } else {
    res.status(401).send({ success: false, message: "Invalid credentials" });
  }
});

app.get("/flashcards", async (req, res) => {
  try {
    const flashcards = await Flashcard.find();
    res.send(flashcards);
  } catch (err) {
    console.error("Error fetching flashcards:", err);
    res.status(500).send("Error fetching flashcards");
  }
});

app.post("/flashcards", async (req, res) => {
  const { question, answer } = req.body;
  try {
    const flashcard = new Flashcard({ question, answer });
    await flashcard.save();
    res.send(flashcard);
  } catch (err) {
    console.error("Error adding flashcard:", err);
    res.status(500).send("Error adding flashcard");
  }
});

app.delete("/flashcards/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Flashcard.findByIdAndDelete(id);
    res.send({ message: "Flashcard deleted successfully" });
  } catch (err) {
    console.error("Error deleting flashcard:", err);
    res.status(500).send("Error deleting flashcard");
  }
});

app.listen(Port, () => {
  console.log(`Server started on port ${Port}`);
});
