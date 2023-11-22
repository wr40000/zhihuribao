import React from "react";
import { NavBar } from "antd-mobile";
import PropTypes from 'prop-types'

export default function NavBarAgain(props) {
  const {title} = props;
  const handleback = () => console.log("NavBar的点击回调被触发了");

  return <NavBar onBack={handleback}>{title}</NavBar>;
}

NavBarAgain.defaultProps = {
  title: '个人中心'
}
NavBarAgain.propTypes = {
  title: PropTypes.string
}
