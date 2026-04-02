//mongodb+srv://csvinesh6_db_user:vinesh123@codenestdb.ez2vnh2.mongodb.net/CodeNestDB?retryWrites=true&w=majority
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

/* =========================
    MongoDB Connection
========================= */

mongoose.connect("mongodb+srv://csvinesh6_db_user:vinesh123@codenestdb.ez2vnh2.mongodb.net/CodeNestDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected 🔥"))
.catch(err => console.log(err));

/* =========================
    User Schema
========================= */

const User = mongoose.model("User", {
  email: String,
  password: String
});

/* =========================
    Signup API
========================= */

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashed
    });

    await user.save();

    res.json({ success: true, message: "User created" });

  } catch (err) {
    res.json({ success: false, message: "Error" });
  }
});

/* =========================
    Login API
========================= */

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign({ email }, "secretkey");

    res.json({ success: true, token });

  } catch (err) {
    res.json({ success: false, message: "Error" });
  }
});

/* =========================
    Start Server
========================= */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});