const express = require("express");
const dotenv = require("dotenv");
const User = require("./models/user.model");
const connectDB = require("./db/connect");
dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await User.create({ name, email });
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
