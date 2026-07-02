import {
  routePathBeforeLogin,
  generateRoutePath,
  routePathAfterLogin,
} from "@/router/route";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";

function Blank() {
  const [allowRoute, setAllowRoute] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // login guard
  useEffect(() => {
    const currentPath = location.pathname;
    const routerPathAfterLogin = routePathAfterLogin();

    authClient
      .getSession()
      .then((session) => {
        if (session.data) {
          // user has been login
          // redirect to the first path of routePathAfterLogin
          navigate(routerPathAfterLogin[0].path, { replace: true });
        } else {
          // redirect to login path if the current path does not exist in routePathBeforeLogin
          if (!routePathBeforeLogin.includes(currentPath)) {
            navigate(generateRoutePath("/login", false), { replace: true });
          } else {
            setAllowRoute(true);
          }
        }
      })
      .catch(() => {
        // error occur
        // default route: login
        if (currentPath !== "/login") {
          navigate(generateRoutePath("/login", false), { replace: true });
        } else {
          setAllowRoute(true);
        }
      });
  }, [location.pathname]);

  return (
    <div className={`min-h-full flex flex-col justify-center items-center`}>
      {allowRoute ? <Outlet /> : null}
    </div>
  );
}

export default Blank;
