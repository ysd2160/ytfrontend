import React from "react";
import { Outlet } from "react-router-dom";
import Navbaar from "../components/Navbaar";
import Sidebaar from "../components/Sidebaar";

const Layout = () => {
  return (
    <>
      <Navbaar />
      <div className="flex min-h-screen bg-black relative">
        {/* Sidebar */}
        <Sidebaar />

        {/* Main content */}
        <div className="flex-1 bg-black p-4 flex justify-center ">
          <div className="w-full ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
