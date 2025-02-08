import { createRoot } from "react-dom/client";

import "./base-styles/colors.css";
import "./base-styles/typography.css";
import "./base-styles/main.css";

import Routes from "./routes";

const element = document.getElementById("app");
if (element) {
  createRoot(element).render(<Routes />);
}
