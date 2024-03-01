import { useState } from "react";
import Link from "next/link";
import { TextField, Button, CircularProgress, Zoom } from "@mui/material";

export default function Home() {
  const [chatRoomName, setChatRoomName] = useState("");
  const [chatRoomID, setChatRoomID] = useState("");
  const [loading, setLoading] = useState(false);

  const createChatRoom = async () => {
    setLoading(true);

    const res = await fetch("/api/chatrooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: chatRoomName,
      }),
    });
    const data = await res.json();

    setChatRoomID(data._id);

    setLoading(false);
  };

  return (
    <div className="index-container">
      <h1>Chat Room</h1>
      <p>
        <b>Simple</b> chat room. <br />
        <b>Share</b> rooms link with others. <br />
        <b>Deleted</b> after 24 hours. <br />
        <b>No</b> sign-up.
      </p>
      <div className="create-chat-room-form">
        <TextField
          color="secondary"
          label="Chat room name"
          onChange={(e) => {
            setChatRoomName(e.target.value);
          }}
          value={chatRoomName}
          variant="standard"
        ></TextField>
        <Button color="secondary" variant="text" onClick={createChatRoom}>
          Create
        </Button>
      </div>
      {loading && <CircularProgress color="secondary"></CircularProgress>}
      {chatRoomID !== "" && (
        <Zoom in={true}>
          <div className="create-chat-room-form-status">
            <p>✅ Chat room created!</p>
            <p>Use this link to join the chat room:</p>
            <Link href={`/chatroom/${chatRoomID}`}>
              {"http://localhost:3000/" + chatRoomID}
            </Link>
          </div>
        </Zoom>
      )}
    </div>
  );
}
