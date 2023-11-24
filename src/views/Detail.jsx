import React from "react";
import { LeftOutline, MessageOutline, LikeOutline, StarOutline, MoreOutline } from 'antd-mobile-icons';
import { Badge, Toast } from 'antd-mobile';


import "./Detail.less";

export default function Detail(props) {
  let {navigate} = props;
  return (
    <div className="detail-box">
      <div className="content"></div>
      {/* 底部图标 */}
      <div className="tab-bar">
        <div className="back">
          <LeftOutline onClick={()=>{navigate(-1)}}/>
        </div>
        <div className="icons">
          <Badge content={666}>
            <MessageOutline />
          </Badge>
          <Badge content={666}>
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
