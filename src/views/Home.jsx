import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HomeHead from "../components/HomeHead";
import NewsItem from "../components/NewsItem";
import SkeletonAgain from "../components/SkeletonAgian";
import _ from "../assets/utils";
import { Swiper, Image, Divider, DotLoading } from "antd-mobile";
import api from "../api/index";
import "./Home.less";

export default function Home() {
  let [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}"));
  let [bannerData, setBannerData] = useState([]);
  let [newsList, setNewsList] = useState([]);
  let loadMore = useRef();
  useEffect(() => {
    (async () => {
      try {
        // api
        //   .queryNewsLatest()
        //   .then((data) => {
        //     // 在这里处理获取到的数据
        //     setToday(data.data.date);
        //     setBannerData(data.data.top_stories);
        //     newsList.push({
        //       date: data.data.date,
        //       stories: data.data.stories,
        //     });
        //     setNewsList([...newsList]);
        //   })
        //   .catch((error) => {
        //     console.error("Error:", error);
        //   });
        let { date, stories, top_stories } = await api.queryNewsLatest();
        setToday(date);
        setBannerData(top_stories);
        // 更新新闻列表状态
        newsList.push({
          date,
          stories,
        });
        setNewsList([...newsList]);
      } catch (_) {}
    })();
  }, []);
  useEffect(() => {
    let ob = new IntersectionObserver(async (changes) => {
      // console.log("Loading More");
      let { isIntersecting } = changes[0];
      if (isIntersecting) {
        // 加载更多按钮出现在视口中，也就是[触底了]
        try {
          // let time = newsList[newsList.length - 1]["date"];
          // await api.queryNewsBefore(time).then((data) => {
          //   let res = data.data;
          //   newsList.push(res);
          //   setNewsList([...newsList]);
          // });
          let time = newsList[newsList.length - 1]["date"];
          let res = await api.queryNewsBefore(time);
          newsList.push(res);
          setNewsList([...newsList]);
        } catch (_) {}
      }
    });
    let loadMoreBox = loadMore.current;
    ob.observe(loadMore.current);
    // 在组件销毁时执行, 手动销毁监视器
    return () => {
      ob.unobserve(loadMoreBox);
      ob = null;
    };
  }, []);

  return (
    <div className="home-box">
      {/* 头部 */}
      <HomeHead today={today}></HomeHead>

      {/* 轮播图 */}
      <div className="swiper-box">
        {bannerData.length > 0 ? (
          <Swiper autoplay={true} loop={true}>
            {bannerData.map((item) => {
              const { title, hint, id, image } = item;
              return (
                <Swiper.Item key={id}>
                  <Link to={{ pathName: `/detail/${id}` }}>
                    {/* <img src={image} alt="" /> */}
                    {/* 懒加载图片 */}
                    <Image src={image} lazy></Image>
                    <div className="desc">
                      <h3 className="title">{title}</h3>
                      <p className="author">{hint}</p>
                    </div>
                  </Link>
                </Swiper.Item>
              );
            })}
          </Swiper>
        ) : null}
      </div>

      {/* 消息列表 */}
      {/* 骨架屏 */}
      {newsList.length == 0 ? (
        <SkeletonAgain></SkeletonAgain>
      ) : (
        newsList.map((item, index) => {
          let { date, stories } = item;
          return (
            <div className="news-box" key={date}>
              {index == 0 ? null : (
                <Divider contentPosition="left">
                  {_.formatTime(date, "{1}月{2}日")}
                </Divider>
              )}
              {stories.map((news, index) => {
                return <NewsItem key={news.id} news={news}></NewsItem>;
              })}
            </div>
          );
        })
      )}

      {/* 加载更多 */}
      <div
        className="loadmore-box"
        ref={loadMore}
        style={{
          display: newsList.length === 0 ? "none" : "block",
        }}
      >
        <DotLoading />
        数据加载中
      </div>
    </div>
  );
}
