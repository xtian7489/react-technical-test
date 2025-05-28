import React from "react";
import Sidebar from "./components/layout/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Sidebar />
      <div className="sm:ml-64">
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
