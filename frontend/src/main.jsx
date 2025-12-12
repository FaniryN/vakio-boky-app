import React from "react";
import ReactDOM from "react-dom/client";
import emailjs from '@emailjs/browser'; // Importez emailjs
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import "./index.css";

// Initialisez EmailJS avec votre clé publique
emailjs.init("WBgfZB8Vl4vTsHiUZ");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);