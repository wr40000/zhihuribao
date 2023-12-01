import React, { useMemo, useEffect } from "react";
import { connect } from "react-redux";
import {useNavigate} from 'react-router-dom'
// import { IMGADRESS } from "../../constant";
import img from "../../assets/images/SYC_1.jpg";
import "../../components/HomeHead/index.less";

// redux
import action from '../../store/action/index.js'

export default connect(
  state => state.base,
  action.base
)(
  function HomeHead(props) {
    let { today, info, queryUserInfoAsync } = props;
    let navigate = useNavigate();
    let time = useMemo(() => {
      let [, month, day] = today.match(/^\d{4}(\d{2})(\d{2})$/);
      const area = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
      ];
  
      return { month: area[+month] + "月", day };
    }, [today]);

    useEffect(()=>{
      if(!info){
        queryUserInfoAsync();
      }
    }, [])
    return (
      <header className="home-haed-box">
        <div className="info">
          <div className="time">
            <span>{time.day}</span>
            <span>{time.month}</span>
          </div>
          <div className="title">知乎日报</div>
        </div>
        <div className="picture" onClick={()=>{
          navigate('/personal')
        }}>
          {/* <img src={`${IMGADRESS}`} alt=""></img> */}
          <img src={info ? info.pic : img} alt=""></img>
        </div>
      </header>
    );
  }
) 
