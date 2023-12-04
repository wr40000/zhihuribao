import React from "react";
import { HashRouter } from "react-router-dom";
import RouterView from "./router/index";
import { KeepAliveProvider } from "keepalive-react-component";

export default function App() {
  return (
    <HashRouter>
      <KeepAliveProvider>
        <RouterView />
      </KeepAliveProvider>
    </HashRouter>
  );
}
