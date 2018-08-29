"use strict";
const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    response: { type: String, required: true },
    receivedMessage: { type: String }
    // created: { type: Date, default: Date.now }
  },
  { timestamps: {} }
);

postSchema.methods.serialize = function() {
  return {
    id: this._id,
    user: this.user,
    title: this.title,
    response: this.response,
    receivedMessage: this.receivedMessage,
    timestamps: this.timestamps
  };
};

const Post = mongoose.model("Post", postSchema);
module.exports = { Post };
