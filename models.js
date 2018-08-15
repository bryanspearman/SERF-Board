"use strict";

const mongoose = require("mongoose");

const userContentSchema = mongoose.Schema({
  title: { type: String, required: true },
  response: { type: String, required: true },
  receivedMessage: { type: String }
});

userContentSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    response: this.response,
    receivedMessage: this.receivedMessage
  };
};

const userContent = mongoose.model("userContent", userContentSchema);
module.exports = { userContent };