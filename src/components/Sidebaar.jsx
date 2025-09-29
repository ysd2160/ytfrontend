import React, { useState } from "react";
import {
  Home,
  Heart,
  Clock,
  Video,
  Folder,
  Users,
  HelpCircle,
  Settings,
  PlaySquare,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebaar = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile sidebar toggle

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, path: "/" },
    { name: "Edit", icon: <Heart size={20} />, path: "/edit" },
    { name: "History", icon: <Clock size={20} />, path: "/history" },
    {
      name: "My Content",
      icon: <Video size={20} />,
      path: `/profile/${user?.username}`,
    },
    { name: "Create", icon: <Folder size={20} />, path: "/create" },
    { name: "Tweets", icon: <Users size={20} />, path: "/tweet" },
  ];

  return (
    <>
      {/* Floating toggle button on mobile */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-0 left-0 z-50 sm:hidden p-1 rounded-full bg-gray-900 text-white shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-60 bg-black text-white flex flex-col justify-between border-r border-gray-800 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:static sm:block`}
      >
        {/* Top Logo */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <PlaySquare size={26} className="text-red-500" />
            <span className="text-lg font-bold tracking-wide">MyTube</span>
          </div>
          {/* Close button on mobile */}
          <button className="sm:hidden" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
            >
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  location.pathname === item.path
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.icon} <span className="text-sm">{item.name}</span>
              </button>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-2 py-4 border-t border-gray-800 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition">
            <HelpCircle size={20} /> <span className="text-sm">Support</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition">
            <Settings size={20} /> <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebaar;
