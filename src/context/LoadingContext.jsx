// src/context/LoadingContext.jsx
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext(null);

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be inside LoadingProvider");
  return ctx;
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <LoadingContext.Provider value={{ loading, setLoading, error, setError }}>
      {children}
    </LoadingContext.Provider>
  );
};
