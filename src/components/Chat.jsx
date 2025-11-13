import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const location = useLocation();
  const targetUser = location.state?.targetUser;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    console.log(chat.data.messages);

    const chatMessages = chat?.data?.messages.map((msg) => {
      return {
        firstName: msg.senderId.firstName,
        lastName: msg.senderId.lastName,
        photoUrl: msg.senderId.photoUrl,
        text: msg.text,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });
    socket.on("messageReceived", ({ firstName, lastName, photoUrl, text }) => {
      console.log(firstName + ": " + text);
      setMessages((messages) => [
        ...messages,
        { firstName, lastName, photoUrl, text },
      ]);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      photoUrl: user?.photoUrl,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    // Send when pressing Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent new line
      sendMessage();
    }
  };

  return (
    <div className="w-[80vw] backdrop-blur-md bg-black/10 border mx-auto border-gray-600 rounded-2xl m-5 h-[80vh] flex flex-col">
      <div className="flex gap-5 items-center px-5 py-3 border-b border-gray-600">
        <div className="w-12 rounded-full">
          <img
            className="rounded-full"
            alt="Tailwind CSS chat bubble component"
            src={targetUser.photoUrl}
          />
        </div>
        <h1 className=" text-xl font-bold">
          {targetUser.firstName} {targetUser.lastName}
        </h1>
      </div>
      <div className="flex-1 overflow-y-scroll p-5">
        {messages &&
          messages.map((msg, index) => {
            return (
              <div
                key={index}
                className={
                  "chat " +
                  (msg?.firstName == user?.firstName
                    ? " chat-end"
                    : " chat-start")
                }>
                {console.log(
                  msg?.firstName == user?.firstName
                    ? " chat-end"
                    : " chat-start"
                )}
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src={msg.photoUrl}
                    />
                  </div>
                </div>
                <div className="chat-header">
                  {msg.firstName === user.firstName
                    ? "You"
                    : `${msg.firstName} ${msg.lastName}`}
                  <time className="text-xs opacity-50">12:45</time>
                </div>
                <div className="chat-bubble">{msg.text}</div>
                <div className="chat-footer opacity-50">Delivered</div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center gap-2 p-3 border-t border-white/20 bg-transparent sm:p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-white/20 text-white placeholder-white/70 rounded-full px-4 py-2 
               focus:outline-none focus:ring-2 focus:ring-white/40 transition w-full 
               text-sm sm:text-base"
        />
        <button
          onClick={sendMessage}
          className="btn btn-secondary px-4 py-2 rounded-full transition active:scale-95 text-sm sm:text-base">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
