import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./utils/Context";
const rootDOM = document.querySelector("#root");

const root = ReactDOM.createRoot(rootDOM);

root.render(
  <AppProvider>
    <App />
  </AppProvider>
);

// import { StrictMode } from "react";
// import ReactDOM from "react-dom/client";
// import { AppProvider } from "./utils/Context";

// import App from "./App";

// const rootElement = document.getElementById("root");
// const root = ReactDOM.createRoot(rootElement);

// root.render(
//   <StrictMode>
//     <AppProvider>
//       <App />
//     </AppProvider>
//   </StrictMode>
//   // rootElement,
//   // renderCallback
// );
