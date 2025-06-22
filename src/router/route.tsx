import { createBrowserRouter } from "react-router";
import Blank from "@/layouts/Blank/Blank";
import Content from "@/layouts/Content/Content";

const loginPathPrefix: string = "/panel";

const generateRoutePath = (path: string, loginPath: boolean = true) => {
  return `${loginPath ? loginPathPrefix : ""}${path}`;
};

const routeBeforeLogin = [
  {
    index: true,
    redirect: generateRoutePath("/login", false),
  },
  {
    pathRegex: `^/login$`,
    path: generateRoutePath("/login", false),
    lazy: async () => {
      const Login = (await import("../pages/Login/Login.tsx")).default;
      return {
        Component: Login,
      };
    },
  },
];

const routePathBeforeLogin = routeBeforeLogin.map((obj: any) => {
  return obj.path;
});

const routeAfterLogin = [
  {
    index: true,
    redirect: "post",
  },

  {
    path: "post",
    name: "Post",
    pathRegex: `^${loginPathPrefix}/post$`,
    children: [
      {
        index: true,
        lazy: async () => {
          const Post = (await import("../pages/Post/Post.tsx")).default;
          return {
            Component: Post,
          };
        },
      },
      {
        path: "add",
        pathRegex: `^${loginPathPrefix}/post/add$`,
        lazy: async () => {
          const PostDetail = (await import("../pages/Post/PostDetail.tsx"))
            .default;
          return {
            Component: PostDetail,
          };
        },
      },
      {
        path: "detail/:id",
        pathRegex: `^(${loginPathPrefix}\/post\/detail\/)[\\w\\d]+$`,
        lazy: async () => {
          const PostDetail = (await import("../pages/Post/PostDetail.tsx"))
            .default;
          return {
            Component: PostDetail,
          };
        },
      },
    ],
  },
  {
    path: "categories",
    name: "Categories",
    pathRegex: `^${loginPathPrefix}/categories$`,
    lazy: async () => {
      const Categories = (await import("../pages/Categories/Categories.tsx"))
        .default;
      return {
        Component: Categories,
      };
    },
  },
  {
    path: "tags",
    name: "Tags",
    pathRegex: `^${loginPathPrefix}/tags$`,
    lazy: async () => {
      const Tags = (await import("../pages/Tags/Tags.tsx")).default;
      return {
        Component: Tags,
      };
    },
  },
];

const routePathAfterLogin = (): Array<{ regex: string; path: string }> => {
  const result: Array<{ regex: string; path: string }> = [];

  routeAfterLogin.forEach((obj: any) => {
    if (obj.pathRegex !== undefined && obj.pathRegex !== null) {
      result.push({
        regex: obj.pathRegex,
        path: `${loginPathPrefix}/${obj.path}`,
      });
    }

    if (obj.children) {
      obj.children.forEach((child: any) => {
        if (child.path !== undefined && child.pathRegex !== null) {
          result.push({
            regex: child.pathRegex,
            path: `${loginPathPrefix}/${obj.path}/${child.path}`,
          });
        }
      });
    }
  });

  return result;
};

const navBarContent = routeAfterLogin
  .filter((obj: any) => {
    return ["Post", "Categories", "Tags"].includes(obj.name);
  })
  .map((obj: any) => {
    return { path: obj.path, name: obj.name };
  });

const router = createBrowserRouter([
  {
    path: loginPathPrefix,
    Component: Content,
    children: routeAfterLogin,
  },
  {
    Component: Blank,
    children: routeBeforeLogin,
  },
]);

export {
  router,
  generateRoutePath,
  routePathBeforeLogin,
  routePathAfterLogin,
  navBarContent,
};
