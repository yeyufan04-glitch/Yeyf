import React from "react";
import { createRoot } from "react-dom/client";
import "../../app/globals.css";
import { DemoApp } from "../../app/components/DemoApp";

window.__MAOZHENG_HASH_ROUTER__ = true;

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DemoApp />
  </React.StrictMode>,
);
