import { useState } from "react";
import { Drawer, Sidebar } from "flowbite-react";
import IconButton from "@/components/ui/button/IconButton";
import { navBarContent } from "@/router/route";
import { Link } from "react-router-dom";
import { clsx } from "clsx";

function CustomDrawer({ currentPath }: { currentPath: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hamburgerIcon: JSX.Element = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );

  return (
    <>
      {/* button to open navigation drawer */}
      <IconButton
        icon={hamburgerIcon}
        outlined={true}
        customAttribute={{
          "data-drawer-target": "drawer-navigation",
          "data-drawer-show": "drawer-navigation",
        }}
        onClick={() => setDrawerOpen(true)}
      ></IconButton>

      {/* navigation drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        <Drawer.Header titleIcon={() => <></>} />

        <Drawer.Items>
          <Sidebar className="[&>div]:bg-transparent [&>div]:p-0">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {navBarContent.map((item, index) => {
                  return (
                    <Sidebar.Item
                      className={clsx(
                        "drawer-item",
                        item.path === currentPath ? "drawer-item-active" : ""
                      )}
                      active={item.path === currentPath}
                      as={Link}
                      to={item.path}
                      onClick={() => {
                        setDrawerOpen(false);
                      }}
                      key={index}
                    >
                      {item.name}
                    </Sidebar.Item>
                  );
                })}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
}

export default CustomDrawer;
