import { createBrowserRouter } from "react-router-dom";
import Blank from "@/layouts/Blank/Blank";
import Content from "@/layouts/Content/Content";

const loginPathPrefix: string = "/panel";

const generateRoutePath = (path: string, loginPath: boolean = true) => {
  return `${loginPath ? loginPathPrefix : ""}${path}`;
};

const routeBeforeLogin = [
  {
    path: generateRoutePath("/login", false),
    lazy: async () => {
      const Login = (await import("../pages/Login/Login.tsx")).default;
      return {
        element: <Login />,
      };
    },
  },
];

const routePathBeforeLogin = routeBeforeLogin.map((obj: any) => {
  return obj.path;
});

const routeAfterLogin = [
  {
    path: generateRoutePath("/post"),
    lazy: async () => {
      const Post = (await import("../pages/Post/Post.tsx")).default;
      return {
        element: <Post />,
      };
    },
  },
];

const routePathAfterLogin = routeAfterLogin.map((obj: any) => {
  return obj.path;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Blank />,
    children: routeBeforeLogin,
  },
  {
    path: loginPathPrefix,
    element: <Content />,
    children: routeAfterLogin,
  },
]);

export { router, generateRoutePath, routePathBeforeLogin, routePathAfterLogin };
