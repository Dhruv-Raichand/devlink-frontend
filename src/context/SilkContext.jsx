// SilkContext.jsx
import { createContext, useContext, useState } from "react";

const SilkContext = createContext(null);

export const useSilk = () => useContext(SilkContext);

export const SilkProvider = ({ children }) => {
  const [pageColor, setPageColor] = useState("#5227ff"); // default purple

  return (
    <SilkContext.Provider value={{ pageColor, setPageColor }}>
      {children}
    </SilkContext.Provider>
  );
};
