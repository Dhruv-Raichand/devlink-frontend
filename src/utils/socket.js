import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const createSocketConnection = () => {
  if (socket) return socket;

  socket = io(BASE_URL, {
    path: "/socket.io",
    withCredentials: true,
  });

  return socket;
};
