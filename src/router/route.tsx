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
    path: generateRoutePath("/post/detail/:id"),
    name: "PostDetail",
    lazy: async () => {
      const PostDetail = (await import("../pages/Post/PostDetail.tsx")).default;
      return {
        element: <PostDetail />,
      };
    },
  },
  // {
  //   path: generateRoutePath("/post/new"),
  //   name: "NewPost",
  //   lazy: async () => {
  //     const PostDetail = (await import("../pages/Post/PostDetail.tsx")).default;
  //     return {
  //       element: <PostDetail />,
  //     };
  //   },
  // },
  {
    path: generateRoutePath("/post"),
    name: "Post",
    lazy: async () => {
      const Post = (await import("../pages/Post/Post.tsx")).default;
      return {
        element: <Post />,
      };
    },
  },
  {
    path: generateRoutePath("/categories"),
    name: "Categories",
    lazy: async () => {
      const Categories = (await import("../pages/Categories/Categories.tsx"))
        .default;
      return {
        element: <Categories />,
      };
    },
  },
  {
    path: generateRoutePath("/tags"),
    name: "Tags",
    lazy: async () => {
      const Tags = (await import("../pages/Tags/Tags.tsx")).default;
      return {
        element: <Tags />,
      };
    },
  },
];

const routePathAfterLogin = routeAfterLogin.map((obj: any) => {
  return obj.path;
});

const navBarContent = routeAfterLogin.map((obj: any) => {
  return { path: obj.path, name: obj.name };
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

export {
  router,
  generateRoutePath,
  routePathBeforeLogin,
  routePathAfterLogin,
  navBarContent,
};
