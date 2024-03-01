import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;
let name;
let socketChatRoom;

export default function Chatroom() {
  const [chatRoom, setChatRoom] = useState("");
  const [messageText, setMessageText] = useState("");

  const sendMessage = async () => {
    const msg = {
      username: name,
      text: messageText,
      chatRoomID: chatRoom._id,
    };

    await fetch("/api/chatrooms", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });

    await fetch("/api/socket");
    socket = io();

    socket.emit("new message", msg);

    setMessageText("");
  };

  const getChatRoom = async () => {
    const res = await fetch(`/api/chatrooms/${id}`, {
      method: "GET",
    });

    const data = await res.json();

    setChatRoom(data);
    socketChatRoom = data;
  };

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      socket.emit("new user", name);
    });

    socket.on("user connected", (data) => {
      const newData = {
        ...socketChatRoom,
        messages: [
          ...socketChatRoom.messages,
          { text: `${data} has connected.`, username: "Bot" },
        ],
      };

      socketChatRoom = newData;
      setChatRoom(socketChatRoom);
    });

    socket.on("user disconnected", (data) => {
      const newData = {
        ...socketChatRoom,
        messages: [
          ...socketChatRoom.messages,
          { text: `${data} has disconnected.`, username: "Bot" },
        ],
      };

      socketChatRoom = newData;
      setChatRoom(socketChatRoom);
    });

    socket.on("new message", (data) => {
      const newData = {
        ...socketChatRoom,
        messages: [...socketChatRoom.messages, data],
      };

      socketChatRoom = newData;
      setChatRoom(socketChatRoom);
    });

    return null;
  };

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

    getChatRoom();

    name = prompt("Enter username");

    while (name === "") {
      name = prompt("Enter username that is not empty you silly little...");
    }

    socketInitializer();
  }, [router.isReady]);

  return (
    <div className="h-[100vh]">
      <div className="pt-12 pl-[10%]">
        <p className="text-left text-purple-700 text-xl">Chat Room</p>
        <h1 className="font-bold text-5xl">{chatRoom.name}</h1>
      </div>

      <div className="flex flex-col gap-2 px-5 py-2 mt-8 overflow-scroll h-[75%] bg-gray-50">
        <div className="mt-auto"></div>

        {chatRoom !== "" &&
          chatRoom.messages.map((message, index) => (
            <div key={index} className={message.username !== name ? "border-[1px] p-3 rounded-2xl w-fit" : "bg-gray-200 p-3 rounded-2xl w-fit self-end"}>
              {message.username}: {message.text}
            </div>
          ))}
      </div>

      <div className="w-full absolute bottom-0 py-5 px-5">
        <div className="flex items-center border-b-2 border-purple-700 py-1">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Message..."
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
            }}
          ></input>
          <button
            className="flex-shrink-0 border-transparent border-4 text-purple-700 hover:text-purple-500 text-sm py-1 px-2 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
