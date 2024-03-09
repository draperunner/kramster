import { createRoot } from "react-dom/client";
import "katex";
import "katex/dist/katex.min.css";

import "./base-styles/colors.css";
import "./base-styles/main.css";
import "./auth";

import Routes from "./routes";

const element = document.getElementById("app");
if (element) {
  createRoot(element).render(<Routes />);
}
