import { navBarContent } from "@/router/route";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageHeaderType {
  rightComponent?: JSX.Element;
}

function PageHeader(props: PageHeaderType) {
  const location = useLocation();
  const [currentPathName, setPathName] = useState("");

  useEffect(() => {
    const navList = navBarContent;
    let pathName = "";

    for (let i = 0; i < navList.length; i++) {
      if (location.pathname === navList[i].path) {
        pathName = navList[i].name;
        break;
      }
    }

    setPathName(pathName);
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-between">
      <div className="text-xl font-semibold text-gray-600 mb-6">
        {currentPathName}
      </div>
      <div>{props.rightComponent}</div>
    </div>
  );
}

export default PageHeader;
