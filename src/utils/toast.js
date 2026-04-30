import { toast } from "react-toastify";

export const getErrorData = (err) => {
  if (err?.response?.status === 429) {
    return {
      message:
        err?.response?.data?.message || "Too many attempts. Try again later",
      retryAfter: err?.response?.data?.retryAfter || null,
    };
  }

  return {
    message:
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.response?.data ||
      "Something went wrong",
    retryAfter: null,
  };
};

export const baseConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  closeButton: true,
};

export const notifySuccess = (msg) => {
  toast.success(msg, baseConfig);
};

export const notifyError = (msg) => {
  toast.error(msg, baseConfig);
};
