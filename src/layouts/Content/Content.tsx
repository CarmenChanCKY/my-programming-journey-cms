import CustomDrawer from "@/components/ui/CustomDrawer";
import { routePathAfterLogin, generateRoutePath } from "@/router/route";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import SessionWebJs from "supertokens-web-js/recipe/session";

function Content() {
  const [allowRoute, setAllowRoute] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // login guard
  useEffect(() => {
    const currentPath = location.pathname;
    const routerPathAfterLogin = routePathAfterLogin();

    SessionWebJs.doesSessionExist()
      .then((isLogin: boolean) => {
        if (isLogin) {
          // user has been login
          const index = routerPathAfterLogin.findIndex((item) => {
            return new RegExp(item.regex).test(currentPath);
          });

          if (index !== -1) {
            setAllowRoute(true);
          } else {
            // redirect to the first path of routePathAfterLogin if the current path does not exist in routePathAfterLogin
            navigate(routerPathAfterLogin[0].path, { replace: true });
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

  return (
    <div className={"min-h-full py-4 px-4 mx-auto max-w-[1000px]"}>
      {/* drawer and cms name */}

      <div className="flex items-center justify-start mb-10">
        <CustomDrawer currentPath={location.pathname}></CustomDrawer>
        <span className="ml-6 uppercase text-lg font-bold select-none">
          My Programming Journey
        </span>
      </div>

      {/* page content */}
      {allowRoute ? <Outlet /> : null}
    </div>
  );
}

export default Content;
