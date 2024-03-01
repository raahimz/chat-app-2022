const connectDB = require("../../../utils/db");
const ChatRoom = require("../../../models/ChatRoom");

// Connect to DB
connectDB();

export default async function handler(req, res) {
  // Getting ID
  const { id } = req.query;

  // @route		GET /api/chatrooms/:id
  // @desc		Get chat room by ID
  if (req.method === "GET") {
    try {
      // Finding chat room by ID
      const chatRoom = await ChatRoom.findById(id);

      // Returning response
      res.status(200).json(chatRoom);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
}
