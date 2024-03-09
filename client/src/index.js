import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./store/auth";
import { ChakraProvider } from "@chakra-ui/react";
import ColorModeSwitcher from "./ColorModeSwitcher";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <ChakraProvider>
      <App />
      <ColorModeSwitcher />
    </ChakraProvider>
  </AuthProvider>
);
