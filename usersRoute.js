const express = require("express");
const router = express.Router();

const User = require("../models/user");


router.post("/register", async (req, res) => {
    try {
        const newuser = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
        const user = await newuser.save();

        res.send("User Registered Successfully");
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email, password: password });
      if (user) {
        const temp = {
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          _id: user._id,
        };
        res.send(temp);
      } else {
        return res.status(400).json({ message: "Login Failed" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  });

  router.get("/getallusers", async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users); // No need to wrap users in an object
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Failed to fetch users", details: error.message });
    }
  });
  

module.exports = router