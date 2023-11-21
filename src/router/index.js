import { Suspense } from "react";
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

// 统一路由配置
const Element = function Element(props) {
  const { path, name, component: Component, meta } = props;
  let { title = "知乎日报-WebAPP" } = meta || {};
  document.title = title;
  const navigate = useNavigate();
  const location = useLocation();
  const parms = useParams();
  const [usp] = useSearchParams();

  return (
    <Component
      navigate={navigate}
      location={location}
      parms={parms}
      usp={usp}
    />
  );
};

export default function RouterView() {
  return (
    <Suspense fallback={<Mask visible={true} opacity="thick">
        <DotLoading color="white"></DotLoading>
    </Mask>}>
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
