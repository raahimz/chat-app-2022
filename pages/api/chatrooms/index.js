const connectDB = require("../../../utils/db");
const ChatRoom = require("../../../models/ChatRoom");

// Connect to DB
connectDB();

export default async function handler(req, res) {
  // @route		POST /api/chatrooms
  // @desc		Create new chat room
  if (req.method === "POST") {
    const newChatRoom = new ChatRoom({
      name: req.body.name,
      messages: [],
    });

    try {
      const saved = await newChatRoom.save();

      res.status(200).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }

  // @route		PUT /api/chatrooms
  // @desc		Add message to chat room
  if (req.method === "PUT") {
    const { chatRoomID, text, username } = req.body;

    try {
      // Finding chat room by ID
      const chatRoom = await ChatRoom.findById(chatRoomID);

      // Adding message
      const newMessage = {
        text: text,
        username: username,
      };

      chatRoom.messages = [...chatRoom.messages, newMessage];

      // Saving chat room
      const saved = await chatRoom.save();

      // Returning response
      res.status(200).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
}
