import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.on("new user", (data) => {
        socket.broadcast.emit("user connected", data);
      });

      socket.on("new message", (data) => {
        io.emit("new message", data);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default SocketHandler;
