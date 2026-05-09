import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const createSocketConnection = () => {
  if (socket) return socket;

  const isLocalhost = location.hostname === "localhost";

  socket = io(isLocalhost ? BASE_URL : "/", {
    path: isLocalhost ? "/socket.io" : "/api/socket.io",
    withCredentials: true,
  });

  return socket;
};
