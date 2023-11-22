import React, { useMemo } from "react";
// import { IMGADRESS } from "../../constant";
import img from "../../assets/images/SYC_1.jpg";
import "../../components/HomeHead/index.less";

export default function HomeHead(props) {
  let { today } = props;
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

    return { month: area[+month] + '月',
             day };
  }, [today]);
  return (
    <header className="home-haed-box">
      <div className="info">
        <div className="time">
          <span>{time.day}</span>
          <span>{time.month}</span>
        </div>
        <div className="title">知乎日报</div>
      </div>
      <div className="picture">
        {/* <img src={`${IMGADRESS}`} alt=""></img> */}
        <img src={img} alt=""></img>
      </div>
    </header>
  );
}
