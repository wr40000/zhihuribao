import { Suspense, useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import routes from "./routes";
import { Mask, DotLoading, Toast } from "antd-mobile";

// redux相关
import store from "../store";
import action from "../store/action";

// 登录态校验 判断当前跳转路由是否需要登录态校验
const isCheckLogin = (path) => {
  // console.log(store); // {dispatch: ƒ, subscribe: ƒ, getState: ƒ, replaceReducer: ƒ, @@observable: ƒ}
  let {
    base: { info },
  } = store.getState();
  let checkList = ["/personal", "/update", "/store"];
  return !info && checkList.includes(path);
};
// 统一路由配置
const Element = function Element(props) {
  const { path, name, component: Component, meta } = props;
  let isShow = isCheckLogin(path); //isShow为true则需要做登录态校验
  let [_, setRandom] = useState(0);

  // 登录态校验
  useEffect(() => {
    if (!isShow) return;
    (async () => {
      let userInfoAction = await action.base.queryUserInfoAsync();
      if (!userInfoAction.info) {
        Toast.show({
          icon: "fail",
          content: "请先登录捏",
        });
        navigate(
          {
            pathname: "/login",
            search: `?to=${path}`,
          },
          { replace: true }
        );
        return;
      }
      // info信息存在，也就是当前状态是已登录
      store.dispatch(userInfoAction);
      setRandom(+new Date());
    })();
  });

  let { title = "知乎日报-WebAPP" } = meta || {};
  document.title = title;
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [usp] = useSearchParams();

  return !isShow ? (
    <Component
      navigate={navigate}
      location={location}
      params={params}
      usp={usp}
    />
  ) : (
    <Mask visible={true} opacity="thick">
      <DotLoading color="white"></DotLoading>
    </Mask>
  );
};

export default function RouterView() {
  return (
    <Suspense
      fallback={
        <Mask visible={true} opacity="thick">
          <DotLoading color="white"></DotLoading>
        </Mask>
      }
    >
      <Routes>
        {routes.map((item) => {
          let { path, name } = item;
          return (
            <Route
              key={name}
              path={path}
              element={<Element {...item} />}
            ></Route>
          );
        })}
      </Routes>
    </Suspense>
  );
}
