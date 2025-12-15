import { createContext, useContext } from "react";

const SilkContext = createContext(null);

export const useSilk = () => {
  const ctx = useContext(SilkContext);
  if (!ctx) {
    throw new Error("useSilk must be used inside SilkProvider");
  }
  return ctx;
};

export default SilkContext;
