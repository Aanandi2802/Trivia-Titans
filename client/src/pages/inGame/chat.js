import React, { useState, useEffect, useCallback, useRef } from "react";
import "./chat.css";
import { useSelector } from 'react-redux';

const Chat = () => {
  const URL = "wss://tbktzinsad.execute-api.us-east-1.amazonaws.com/production";

  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [members, setMembers] = useState([]);
  const [chatRows, setChatRows] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userData = useSelector((state) => state.loginStatus.userInfo);

  const onSocketOpen = useCallback(() => {
    setIsConnected(true);
    const name = userData.firstName;
    socket.current?.send(JSON.stringify({ action: "setName", name }));
    // setName();
  }, []);

  const onSocketClose = useCallback(() => {
    setMembers([]);
    setIsConnected(false);
    setChatRows([]);

    setChatRows((prevChatRows) => [
      ...prevChatRows,
      <span>
        <i>You have left the chat</i>
      </span>,
    ]);
  }, []);

  const onSocketMessage = useCallback((dataStr) => {
    const data = JSON.parse(dataStr);
    if (data.members) {
      setMembers(data.members);
    } else if (data.publicMessage) {
      setChatRows((prevChatRows) => [
        ...prevChatRows,
        <span>
          <b>{data.publicMessage}</b>
        </span>,
      ]);
    } else if (data.privateMessage) {
      alert(data.privateMessage);
    } else if (data.systemMessage) {
      setChatRows((prevChatRows) => [
        ...prevChatRows,
        <span>
          <i>{data.systemMessage}</i>
        </span>,
      ]);
    }
  }, []);

  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener("open", onSocketOpen);
      socket.current.addEventListener("close", onSocketClose);
      socket.current.addEventListener("message", (event) => {
        onSocketMessage(event.data);
      });
    }
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return; // Prevent sending empty messages

    // Send the public message to the WebSocket server
    socket.current?.send(
      JSON.stringify({ action: "sendPublic", message: newMessage })
    );

    // Clear the input field after sending the message
    setNewMessage("");
  };

  useEffect(() => {
    // Connect to the WebSocket when the component mounts
    onConnect();

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (isConnected) {
        socket.current?.close();
      }
    };
  }, [isConnected]);

  useEffect(() => {
    // This effect will be triggered whenever there's a new message received
    // via the WebSocket. It will add the message to the chatRows state.
    const handleNewMessage = (data) => {
      const parsedData = JSON.parse(data);
      if (parsedData.publicMessage) {
        setChatRows((prevChatRows) => [
          ...prevChatRows,
          <span>
            <b>{parsedData.publicMessage}</b>
          </span>,
        ]);
      } else if (parsedData.privateMessage) {
        alert(parsedData.privateMessage);
      } else if (parsedData.systemMessage) {
        setChatRows((prevChatRows) => [
          ...prevChatRows,
          <span>
            <i>{parsedData.systemMessage}</i>
          </span>,
        ]);
      }
    };

    socket.current?.addEventListener("message", handleNewMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.current?.removeEventListener("message", handleNewMessage);
    };
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {chatRows.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          style={{ fontSize: "16px" }}
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
