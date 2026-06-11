// models/User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },

  firstName: String,

  lastName: String,

  email: {
    type: String,
    unique: true,
  },

  lastLogin: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);