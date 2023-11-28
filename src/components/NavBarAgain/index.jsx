import React from "react";
import { NavBar } from "antd-mobile";
import PropTypes from 'prop-types'
import { useNavigate, useLocation, useSearchParams} from 'react-router-dom'

import './index.less'

export default function NavBarAgain(props) {
  const {title} = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [usp] = useSearchParams();

  const handleback = () => {
    // 特殊 : 登录页 & to的值是/detail/XXX
    let to = usp.get('to');
    // console.log(/^\/detail\/\d+$/.test(to));
    if(location.pathname == 'login' && /^\/detail\/\d+$/.test(to)){
      navigate(to, {replace:true})
      return;
    }
    navigate(-1);
  };

  return <NavBar className="navbar-again-box" onBack={handleback}>{title}</NavBar>;
}

NavBarAgain.defaultProps = {
  title: '个人中心'
}
NavBarAgain.propTypes = {
  title: PropTypes.string
}
