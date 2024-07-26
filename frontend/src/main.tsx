import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupOTelSDK } from "./otel.ts";

setupOTelSDK();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
