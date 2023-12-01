import React, { useState, useEffect, useMemo } from "react";
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

// redux
import { connect } from "react-redux";
import action from "../store/action/index";

export default connect(
  (state) => {
    return {
      base: state.base,
      store: state.store,
    };
  },
  { ...action.base, ...action.store }
)(function Detail(props) {
  let {
    navigate,
    params,
    location,
    base: { info: userInfo },
    queryUserInfoAsync,
    clearStoreList,
    queryStoreListAsync,
    removeStoreListById,
    store: { list: storeList },
  } = props;
  let [info, setInfo] = useState(null);
  let [extra, setExtra] = useState(null); //评论 收藏 点赞信息
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

  // 下面是关于处理收藏的逻辑
  useEffect(() => {
    (async () => {
      // 如果userInfo不存在，则派发请求同步userInfo
      if (!userInfo) {
        let { info } = await queryUserInfoAsync();
        userInfo = info;
      }
      // 如果已经登录 && 没有收藏列表信息:派发任务同步收藏列表
      if (userInfo && !storeList) {
        queryStoreListAsync();
      }
    })();
  }, []);
  let isStore = useMemo(() => {
    if (!storeList) return false;
    return storeList.some((item) => {
      return +item.news.id === +params.id;
    });
  }, [storeList, params]);
  const handleStore = async () => {
    // 未登录
    if (!userInfo) {
      Toast.show({
        icon: "",
        content: "还没有登录捏1",
      });
      navigate(`/login?to=${location.pathname}`, { replace: true });
    }
    // 已登录 移除收藏
    if (isStore) {
      // 找到收藏的id,这个和新闻id不一样
      let item = storeList.find((item) => {
        return +item.news.id === +params.id;
      });
      if (!item) return;
      let { code } = await api.storeRemove(item.id);
      if (code !== 0) {
        Toast.show({
          icon: "fail",
          content: "操作失败了捏",
        });
        return;
      }
      Toast.show({
        icon: "success",
        content: "取消收藏了捏",
      });
      removeStoreListById(item.id); // 移除redux中的这一项
      return;
    }
    // 没有收藏
    try {
      let { code } = await api.store(params.id);
      if (code !== 0) {
        Toast.show({
          icon: "fail",
          content: "收藏失败了捏",
        });
      }
      Toast.show({
        icon: "success",
        content: "收藏成功了捏",
      });
      queryStoreListAsync(); //同步最新的收藏列表到redux容器中
    } catch (_) {}
  };

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
          {/* 评论 */}
          <Badge content={extra ? extra.comments : 0}>
            <MessageOutline />
          </Badge>
          {/* 点赞 */}
          <Badge content={extra ? extra.popularity : 0}>
            <LikeOutline />
          </Badge>
          {/* 收藏 */}
          <span className={isStore ? "stored" : ""} onClick={handleStore}>
            <StarOutline />
          </span>
          <span>
            <MoreOutline />
          </span>
        </div>
      </div>
    </div>
  );
});
