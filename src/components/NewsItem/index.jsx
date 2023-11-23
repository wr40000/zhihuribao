import React from "react";
import { Link } from "react-router-dom";
import {PropTypes} from 'prop-types'
import "./index.less";
import { Image } from "antd-mobile";

export default function NewsItem(props) {
  let {news:{hint, id, images, title, url}} = props;
  if( !Array.isArray(images) ) images = [''];
  return (
    <div className="news-item-box">
      {/* pathname首字注意小写 */}
      <Link to={{pathname: `/detail/${id}`}}>
        <div className="content">
          <h4 className="title">{title}</h4>
          <p className="author">{hint}</p>
        </div>
        <Image src={`${images[0]}`} lazy></Image>
      </Link>
    </div>
  );
}

NewsItem.defaultProps = {
  news: null
}
// propTypes首字母注意小写
NewsItem.propTypes = {
  news: PropTypes.object
}
