import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./utils/Context";
import { CookiesProvider } from "react-cookie";
const rootDOM = document.querySelector("#root");

const root = ReactDOM.createRoot(rootDOM);

root.render(
  <AppProvider>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </AppProvider>
);
