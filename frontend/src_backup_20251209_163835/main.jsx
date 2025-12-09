// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Helmet } from 'react-helmet';

// import './index.css';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <React.StrictMode>
//     <Helmet
//       defaultTitle='Vakio Boky Initiative'
//       titleTemplate='%s | Découvrez, lisez et partagez la passion de la littérature malgache et francophone.'
//     >
//       <meta charSet='utf-8' />
//       <html lang='fr' amp />
//     </Helmet>
//     <App />
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
