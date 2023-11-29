import React, { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import {
  LeftOutline,
  MessageOutline,
  LikeOutline,
  StarOutline,
  MoreOutline,
} from "antd-mobile-icons";
import { Badge, Toast } from "antd-mobile";
import SkeletonAgain from "../components/SkeletonAgian";
import api from "../api/index";
import "./Detail.less";

export default function Detail(props) {
  let { navigate, params } = props;
  let [info, setInfo] = useState(null);
  let [extra, setExtra] = useState(null);
  let link;

  // react的状态更改是异步批处理
  // 处理样式图片
  const handleStyle = (data) => {
    let css = data.css;
    if (!Array.isArray(css)) return;
    css = css[0];
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = css;
    document.head.appendChild(link);
  };
  const handleImage = (data) => {
    let imgPlaceHolder = document.querySelector(".img-place-holder");
    let headline = document.querySelector(".headline");
    if (!imgPlaceHolder) return;
    let imgContainer = new Image();
    imgContainer.src = data.image;
    imgContainer.onload = () => {
      imgPlaceHolder.appendChild(imgContainer);
    };
    imgContainer.onerror = () => {
      let parent = imgPlaceHolder.parentNode;
      parent.parentNode.removeChild(parent);
    };
    // 添加标题
    let title = document.createElement("div");
    title.innerHTML = `${data.title}`;
    // 添加样式
    title.style.color = "#EEE";
    headline.style.position = "relative";
    title.style.position = "absolute";
    title.style.margin = "0 10px 0 10px";
    title.style.fontSize = "24px";
    title.style.fontFamily = "Simsun";
    title.style.fontWeight = "200";
    title.style.bottom = "10px";
    title.style.letterSpacing = "2px";
    // 将元素添加到页面的某个容器中
    headline.appendChild(title);
  };

  useEffect(() => {
    // api.queryNewsInfo(params.id).then((data) => {
    //   flushSync(() => {
    //     setInfo(data.data);
    //     handleStyle(data.data);
    //   });
    //   handleImage(data.data);
    // });
    (async () => {
      try {
        let result = await api.queryNewsInfo(params.id);
        flushSync(() => {
          setInfo(result);
          handleStyle(result);
        });
        handleImage(result);
      } catch (_) {}
    })();
    return () => {
      if (link) document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    // api.queryStoryExtra(params.id).then((data) => {
    //   setExtra(data.data);
    // });
    (async () => {
      try {
        let result = await api.queryStoryExtra(params.id);
        setExtra(result);
      } catch (_) {}
    })();
  }, []);

  return (
    <div className="detail-box">
      {!info ? (
        <SkeletonAgain></SkeletonAgain>
      ) : (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: info.body }}
        ></div>
      )}

      {/* 底部图标 */}
      <div className="tab-bar">
        <div className="back">
          <LeftOutline
            onClick={() => {
              navigate(-1);
            }}
          />
        </div>
        <div className="icons">
          <Badge content={extra ? extra.comments : 0}>
            <MessageOutline />
          </Badge>
          <Badge content={extra ? extra.popularity : 0}>
            <LikeOutline />
          </Badge>
          <span className={"stored"}>
            <StarOutline />
          </span>
          <span>
            <MoreOutline />
          </span>
        </div>
      </div>
    </div>
  );
}
