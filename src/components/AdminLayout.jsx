import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../utils/auth";
import {
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineFolder,
  HiOutlineBriefcase,
  HiOutlineGlobeAlt,
  HiOutlineLink,
  HiOutlineLogout,
  HiMenu,
  HiX,
} from "react-icons/hi";

const navigationItems = [
  { name: "Hero Section", path: "/", icon: HiOutlineSparkles },
  { name: "About Section", path: "/about", icon: HiOutlineUser },
  { name: "Portfolio Section", path: "/portfolio", icon: HiOutlineFolder },
  { name: "Resume Section", path: "/resume", icon: HiOutlineBriefcase },
  { name: "Company Logos", path: "/companies", icon: HiOutlineGlobeAlt },
  { name: "Footer Section", path: "/footer", icon: HiOutlineLink },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      clearAdminToken();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Upper Sidebar */}
        <div className="flex flex-col overflow-y-auto flex-1">
          {/* Brand Logo Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
                A
              </div>
              <span className="text-gray-900 font-bold text-lg tracking-tight">
                Pyush<span className="text-primary font-semibold">Admin</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden cursor-pointer"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold shadow-xs"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Lower Sidebar / User Info & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/40 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-primary/20">
                A
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate font-sans">
                  Administrator
                </p>
                <p className="text-xs text-gray-400 truncate font-sans">
                  admin@pyushanand.com
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-gray-700 text-sm font-medium transition-all duration-200 cursor-pointer"
          >
            <HiOutlineLogout className="w-4 h-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Right Side Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden lg:h-screen lg:overflow-y-auto">
        {/* Header (Mobile Toggle & Title) */}
        <header className="h-16 border-b border-gray-200/80 bg-white flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 lg:hidden cursor-pointer"
            >
              <HiMenu className="w-5 h-5" />
            </button>
            <h2 className="text-gray-900 font-bold text-lg hidden sm:block tracking-tight">
              Dashboard Panel
            </h2>
          </div>

          {/* System Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Live</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
