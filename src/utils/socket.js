import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  const isLocalhost = location.hostname === "localhost";

  return io(isLocalhost ? BASE_URL : "/", {
    path: isLocalhost ? "/socket.io" : "/api/socket.io",
    withCredentials: true,
  });
};
