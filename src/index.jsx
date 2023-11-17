// 程序打包入口
import React from "react";
import ReactDOM from "react-dom/client";
import App from './App'

import zhCN from 'antd/locale/zh_CN';
import {ConfigProvider} from 'antd-mobile'

import "lib-flexible";
import "./index.less";

/* 处理最大宽度 */
(function () {
  const handleMax = function handleMax() {
    let root = document.getElementById("root");
    let html = document.documentElement;
    let deviceW = html.clientWidth;
    root.style.maxWidth = "750px";
    if (deviceW >= 750) {
      html.style.fontSize = 75 + "px";
    }
  };
  handleMax();
})();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
);