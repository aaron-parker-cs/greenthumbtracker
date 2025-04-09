import AppNavbar from "./components/common/AppNavbar";
import AppFooter from "./components/common/AppFooter";
import { Outlet } from "react-router-dom";
import AppDrawer from "./components/common/AppDrawer";

export const Layout = () => {
  return (
    <>
      <AppNavbar />
      <AppDrawer />
      <Outlet />
      <AppFooter />
    </>
  );
};
