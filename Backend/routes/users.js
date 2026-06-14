// routes/users.js

const router = require("express").Router();

const User = require("../models/User");

const auth = require("../middleware/auth");

router.post("/sync", async (req, res) => {
  console.log("================================");
  console.log("SYNC REQUEST RECEIVED");
  console.log(req.body);
  try {
    const {
      clerkId,
      email,
      firstName,
      lastName,
    } = req.body;

    let user = await User.findOne({
      clerkId,
    });

    if (!user) {
      user = await User.create({
        clerkId,
        email,
        firstName,
        lastName,
      });
    }
    console.log("User found:", user);


    user.lastLogin = new Date();

    await user.save();

    res.json(user);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;