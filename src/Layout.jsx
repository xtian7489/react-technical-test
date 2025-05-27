import React from "react";
import Sidebar from "./components/layout/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Sidebar />
      <div className="sm:ml-64">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
