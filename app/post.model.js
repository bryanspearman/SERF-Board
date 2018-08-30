"use strict";
const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  response: { type: String, required: true },
  receivedMessage: { type: String },
  created: { type: Date, default: Date.now }
});

postSchema.methods.serialize = function() {
  return {
    id: this._id,
    user: this.user,
    title: this.title,
    response: this.response,
    receivedMessage: this.receivedMessage,
    created: this.created
  };
};

const Post = mongoose.model("Post", postSchema);
module.exports = { Post };
