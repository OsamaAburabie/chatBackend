const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    // _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    received: { type: String, default: "true" },
    date: { type: Date },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
