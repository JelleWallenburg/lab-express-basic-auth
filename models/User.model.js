const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true // username must be unique
  },
  password: String //password should be encrypted
});

const User = model("User", userSchema);

module.exports = User;
