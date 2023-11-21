import React from "react";
import { HashRouter } from "react-router-dom";
import RouterView from './router/index'

export default function App() {
  return (
    <HashRouter>
      <RouterView/>
    </HashRouter>
  );
}
