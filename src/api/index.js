import http from "./http";
import axios from "axios";

// 获取今日新闻信息 & 轮播图信息
// const queryNewsLatest = () => http.get('/news_latest')
const queryNewsLatest = () =>
  axios({
    method: "get",
    url: "http://139.159.253.241:7100/news_latest",
  }).then(function (response) {
    return response;
  });

// 获取往日新闻信息
// const queryNewsBefore = (time) => {return http.get("/api/news_before", {params: {time,},});};
const queryNewsBefore = (time) =>
  axios({
    method: "get",
    url: "http://139.159.253.241:7100/news_before",
    params: { time },
  }).then(function (response) {
    return response;
  });

// 获取新闻详细信息
// const queryNewsInfo = (id) => {return http.get("/api/news_info", {params: {id,},});};
const queryNewsInfo = (id) =>
  axios({
    method: "get",
    url: "http://139.159.253.241:7100/news_info",
    params: {
      id,
    },
  }).then(function (response) {
    return response;
  });

// 获取新闻点赞信息
const queryStoryExtra = (id) => {
  return http.get("/api/story_extra", {
    params: {
      id,
    },
  });
};

const api = {
  queryNewsLatest,
  queryNewsBefore,
  queryNewsInfo,
  queryStoryExtra,
};

export default api;
