import CustomDrawer from "@/components/ui/CustomDrawer";
import { routePathAfterLogin, generateRoutePath } from "@/router/route";
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
          if (!routePathAfterLogin.includes(currentPath)) {
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

  return (
    <div className={"min-h-full"}>
      <div className={"min-h-full my-4 px-4 mx-auto max-w-[1000px]"}>
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
    </div>
  );
}

export default Content;
