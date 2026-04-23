import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { createSocketConnection } from "../../utils/socket";
import { useSelector } from "react-redux";
import api from "../../utils/api";

const Chat = () => {
  const { targetUserId } = useParams();
  const location = useLocation();
  const targetUser = location.state?.targetUser;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const chat = await api.get("/chat/" + targetUserId);
        setMessages(
          chat?.data?.data?.messages.map((msg) => ({
            firstName: msg.senderId.firstName,
            lastName: msg.senderId.lastName,
            photoUrl: msg.senderId.photoUrl,
            text: msg.text,
            createdAt: msg.createdAt,
          })),
        );
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });
    socket.on(
      "messageReceived",
      ({ firstName, lastName, photoUrl, text, createdAt }) => {
        setMessages((prev) => [
          ...prev,
          { firstName, lastName, photoUrl, text, createdAt },
        ]);
      },
    );
    return () => socket.disconnect();
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

  const formatTime = (date) =>
    new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const getAvatar = (photoUrl, name) =>
    photoUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6d28d9&color=fff`;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-6 h-[calc(100vh-58px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1e1d28] mb-4">
        {targetUser && (
          <Link
            to={`/app/profile/${targetUserId}`}
            state={{ targetUser }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity no-underline">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#2d2b40] flex-shrink-0">
              <img
                src={getAvatar(
                  targetUser.photoUrl,
                  `${targetUser.firstName} ${targetUser.lastName}`,
                )}
                alt={targetUser.firstName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-['Outfit'] font-bold text-[15px] text-white">
                {targetUser.firstName} {targetUser.lastName}
              </h1>
              <p className="text-[11px] text-[#6b6880]">View profile</p>
            </div>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
        {messages.map((msg, index) => {
          const isMe = msg.firstName === user?.firstName;
          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#2d2b40] flex-shrink-0">
                <img
                  src={getAvatar(
                    msg.photoUrl,
                    `${msg.firstName} ${msg.lastName}`,
                  )}
                  alt={msg.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bubble */}
              <div
                className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    isMe ?
                      "bg-violet-700 text-white rounded-br-sm"
                    : "bg-[#1a1928] border border-[#2d2b40] text-[#e8e6f0] rounded-bl-sm"
                  }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#4a4760] px-1">
                  {isMe ? "You" : msg.firstName} ·{" "}
                  {msg.createdAt ? formatTime(msg.createdAt) : ""}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-[#1e1d28] mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 bg-[#13121c] border border-[#2d2b40] text-[#e8e6f0] placeholder-[#3a3850] rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-violet-600 transition-colors"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none flex-shrink-0">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
