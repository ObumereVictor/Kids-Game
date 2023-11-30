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
