import React from "react";
import NavBarAgain from "../components/NavBarAgain";
import { Form, Input, Button, Toast } from "antd-mobile";
import "./Login.less";

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
export default function Login() {
  // 状态
  const [formIns] = Form.useForm();
  // 提交表单
  const submit = (value) => {
    console.log(value);
  };
  // 发送验证码 校验
  const send = async () => {
    try {
      await formIns.validateFields("phone");
    } catch (_) {}
  };
  return (
    <div className="login-box">
      <NavBarAgain title="登录/注册"></NavBarAgain>
      <Form
        layout="horizontal"
        style={{ "--border-top": "none" }}
        footer={
          <Button color="primary" type="submit">
            提交
          </Button>
        }
        onFinish={submit}
        form={formIns}
        initialValues={{ phone: "", code: "" }}
      >
        <Form.Item name="phone" label="手机号" rules={[{validator: validate.phone}]}>
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          name="code"
          label="验证码"
          extra={
            <Button size="small" color="primary" onClick={send}>
              发送验证码
            </Button>
          }
          rules={[{validator: validate.code}]}
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
}
