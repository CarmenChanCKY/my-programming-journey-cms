import { useState } from "react";
import { Drawer, Sidebar } from "flowbite-react";
import IconButton from "@/components/ui/button/IconButton";
import { generateRoutePath, navBarContent } from "@/router/route";
import { Link, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { cmsSignout } from "@/helper/fetcher";
import { hamburgerIcon } from "@/components/ui/IconElement";

function CustomDrawer({ currentPath }: { currentPath: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* button to open navigation drawer */}

      <IconButton
        icon={hamburgerIcon}
        outline
        color="secondary"
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

              <Sidebar.ItemGroup>
                <Sidebar.Item
                  className="cursor-pointer"
                  onClick={async (e: any) => {
                    e.stopPropagation();
                    await cmsSignout();
                    navigate(generateRoutePath("/login", false), {
                      replace: true,
                    });
                  }}
                >
                  Logout
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
}

export default CustomDrawer;
