import {
  routePathAfterLogin,
  routePathBeforeLogin,
  generateRoutePath,
} from "@/router/route";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SessionWebJs from "supertokens-web-js/recipe/session";

function Content() {
  const [allowRoute, setAllowRoute] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // login guard
  useEffect(() => {
    const currentPath = location.pathname;

    SessionWebJs.doesSessionExist()
      .then((isLogin: boolean) => {
        if (isLogin) {
          // user has been login
          // redirect to the first path of routePathAfterLogin if the current path does not exist in routePathAfterLogin
          if (!routePathBeforeLogin.includes(currentPath)) {
            navigate(routePathAfterLogin[0], { replace: true });
          } else {
            setAllowRoute(true);
          }
        } else {
          // redirect to login path
          navigate(generateRoutePath("/login", false), { replace: true });
        }
      })
      .catch(() => {
        // error occur
        // default route: login
        navigate(generateRoutePath("/login", false), { replace: true });
      });
  }, [location.pathname]);

  return <div>{allowRoute ? <Outlet /> : null}</div>;
}

export default Content;
