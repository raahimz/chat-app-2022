const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  messages: [
    {
      text: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: false,
        default: Date.now,
      },
    },
  ],
});

module.exports =
  mongoose.models.chatRoom || mongoose.model("chatRoom", ChatRoomSchema);
