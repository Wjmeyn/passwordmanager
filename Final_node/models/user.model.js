const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//TODO: notice that User has evolved and not includes 'caloriegoal' and 'minutegoal'.
const schema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true },
  mycredentials: {
    type: [],
    required: true,
    credentials: {
      owner: { type: String, required: true },
      domain: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
      expiry: { type: Date, required: false },
      createdDate: { type: Date, default: Date.now },
      access: {
        type: [],
        required: false,
        hasaccess: { type: String, required: true },
      },
    },
  },
  shared: {
    type: [],
    required: true,
    credentials: {
      owner: { type: String, required: true },
      domain: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
      expiry: { type: Date, required: false },
      createdDate: { type: Date, default: Date.now },
      access: {
        type: [],
        required: false,
        hasaccess: { type: String, required: true },
      },
    },
  },
  sharedwith: {
    type: [],
    required: true,
    credentials: {
      owner: { type: String, required: true },
      domain: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
      expiry: { type: Date, required: false },
      createdDate: { type: Date, default: Date.now },
      access: {
        type: [],
        required: false,
        hasaccess: { type: String, required: true },
      },
    },
  },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", schema);
