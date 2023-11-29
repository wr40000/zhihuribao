import React, { useState, useEffect } from "react";
import NavBarAgain from "../components/NavBarAgain";
import { Form, Input, Toast } from "antd-mobile";
import ButtonAgain from "../components/ButtonAgain";
import api from "../api/index";
import "./Login.less";
import _ from "../assets/utils";

// 仓库相关配置
import { connect } from "react-redux";
import action from "../store/action/index";

/* 自定义表单校验规则 */
const validate = {
  phone(_, value) {
    value = value.trim();
    let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
    if (value.length === 0) return Promise.reject(new Error("手机号是必填项!"));
    if (!reg.test(value)) return Promise.reject(new Error("手机号格式有误!"));
    return Promise.resolve();
  },
  code(_, value) {
    value = value.trim();
    let reg = /^\d{6}$/;
    if (value.length === 0) return Promise.reject(new Error("验证码是必填项!"));
    if (!reg.test(value)) return Promise.reject(new Error("验证码格式有误!"));
    return Promise.resolve();
  },
};
function Login(props) {
  let { navigate, usp, queryUserInfoAsync } = props;
  // 状态
  const [formIns] = Form.useForm(); // form实例
  const [disabled, setDisabled] = useState(false);
  const [sendText, setSendText] = useState("发送验证码");

  // 提交表单
  const submit = async () => {
    try {
      await formIns.validateFields();
      let { phone, code } = formIns.getFieldValue();
      // let data = await api.login(phone, code);
      // let { code: codeHttp, token } = data;
      let { code: codeHttp, token } = await api.login(phone, code);
      if (+codeHttp !== 0) {
        Toast.show({
          icon: "fail",
          content: "登录失败了捏",
        });
        formIns.resetFields(["code"]);
        return;
      }
      // 登录成功 存储token, 登陆者信息到redux，提示，跳转
      _.storage.set("tk", token);
      await queryUserInfoAsync(); // 派发任务，同步redux中的状态信息
      Toast.show({
        icon: "success",
        content: "登陆成功",
      });
      navigate(-1);
      let to = usp.get("to");
      to ? navigate(to, { replace: true }) : navigate(-1);
    } catch (_) {}
  };
  // 发送验证码 校验
  // 延迟函数
  // const delay = (interval) => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve();
  //     }, interval);
  //   });
  // };
  let timer = null;
  let num = 3;
  const countDown = () => {
    num--;
    if (num === 0) {
      clearInterval(timer);
      timer = null;
      setSendText(`发送验证码`);
      setDisabled(false);
      return; // 不加return就会显示 0s后重发
    }
    setSendText(`${num}s后重发`);
  };
  const send = async () => {
    let phone = formIns.getFieldValue("phone");
    try {
      // await formIns.validateFields(["phone"]); //特莫是数组
      // api.sendPhoneCode(phone).then((data) => {
      //   let { code } = data;
      //   if (+code !== 0) {
      //     Toast.show({
      //       icon: "fail",
      //       content: "发送失败",
      //     });
      //     return;
      //   }
      //   // 发送成功
      //   setDisabled(true);
      //   countDown();
      //   if (!timer) timer = setInterval(countDown, 1000);
      // });
      await formIns.validateFields(["phone"]);
      let phone = formIns.getFieldValue("phone");
      let { code } = await api.sendPhoneCode(phone);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "发送失败",
        });
        return;
      }
      // 发送成功
      setDisabled(true);
      countDown();
      if (!timer) timer = setInterval(countDown, 1000);
    } catch (_) {}
  };
  // 组件销毁的时候:把没有清除的定时器干掉
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, []);
  return (
    <div className="login-box">
      <NavBarAgain title="登录/注册"></NavBarAgain>
      <Form
        layout="horizontal"
        style={{ "--border-top": "none" }}
        footer={
          <ButtonAgain color="primary" type="submit" onClick={submit}>
            提交
          </ButtonAgain>
        }
        onFinish={submit}
        form={formIns}
        initialValues={{ phone: "", code: "" }}
      >
        <Form.Item
          name="phone"
          label="手机号"
          rules={[{ validator: validate.phone }]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          name="code"
          label="验证码"
          extra={
            <ButtonAgain
              size="small"
              color="primary"
              onClick={send}
              disabled={disabled}
            >
              {sendText}
            </ButtonAgain>
          }
          rules={[{ validator: validate.code }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
}

export default connect(null, action.base)(Login);
