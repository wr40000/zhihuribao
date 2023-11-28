import React, {useState} from "react";
import { Button } from "antd-mobile";


export default function ButtonAgain(props) {
  let options = {...props};
  let {children, onClick: handle} = options;
  delete options.children;
  delete options.onClick

  // 状态
  let [loading, setLoading] = useState(false);
  const onclickHandle = async () => {
    setLoading(true);
    try{
      await handle();
    }catch(_){}
    setLoading(false)
  }
  if (handle) {
    options.onClick = onclickHandle;
}
  
  return (
    <>
      <Button {...options} loading={loading}>
        {children}
      </Button>
    </>
  );
}
