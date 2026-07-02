import axios from "axios";
import { BASE_URL } from "./constants";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let store;
const getStore = async () => {
  if (!store) {
    store = (await import("../store/appStore")).default;
  }
  return store;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        const s = await getStore();
        const { removeUser } = await import("../store/userSlice");
        s.dispatch(removeUser());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
