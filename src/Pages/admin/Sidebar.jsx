import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Store,
  Users,
  Package,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { asynclogout } from "../../store/userAction";

export default function Sidebar() {
  const { role, user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    if (window.confirm("Are you really want to logout?")) {
      dispatch(asynclogout());
      navigate("/");
    }
  };

  // Navigation items based on role
  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin",
      roles: ["admin", "super admin"],
    },
    {
      icon: Users,
      label: "Admins",
      path: "/admin/admins",
      roles: ["super admin"],
    },
    {
      icon: Store,
      label: "Dharamshala",
      path: "/admin/dharamshala",
      roles: ["admin", "super admin"],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter((item) =>
    item.roles.includes(role)
  );

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-3 bg-primary text-white rounded-lg shadow-lg hover:bg-orange-600 transition-all duration-200"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-overlay bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-[#3f3f3f] text-white z-50 transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : isMobile ? "w-0 left-[-50px]" : "w-[72px]"}
        ${isMobile ? "shadow-2xl" : "shadow-lg"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center ${
              isOpen ? "justify-between" : "justify-center"
            } p-4 border-b border-gray-600`}
          >
            <Link
              to="/"
              className={`flex items-center gap-3 transition-all duration-300`}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-white text-xl p-1 flex-shrink-0">
                <img src="/logo.png" alt="" />
              </div>
              {isOpen && (
                <div className="text-xl font-bold text-white whitespace-nowrap">
                  Bijalpursewa
                </div>
              )}
            </Link>

            {isMobile && isOpen && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6">
            <ul className="space-y-2">
              {filteredNavItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);

                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      onClick={() => isMobile && setIsOpen(false)}
                      className={`
                        flex items-center rounded-lg transition-all duration-200 group relative
                        ${
                          isOpen
                            ? "space-x-3 px-3 py-3"
                            : "justify-center px-3 py-3 mx-1"
                        }
                        ${
                          isActive
                            ? "bg-primary text-white shadow-lg"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }
                      `}
                    >
                      <Icon
                        size={20}
                        className={`
                          transition-transform duration-200 group-hover:scale-110 flex-shrink-0
                          ${
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-white"
                          }
                        `}
                      />

                      {/* Text label - only show when sidebar is open */}
                      {isOpen && (
                        <span className="font-medium whitespace-nowrap">
                          {item.label}
                        </span>
                      )}

                      {/* Tooltip for collapsed state on desktop */}
                      {!isOpen && !isMobile && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-gray-600 pointer-events-none">
                          {item.label}
                          {/* Tooltip arrow */}
                          <div className="absolute left-[-4px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-4 border-r-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-2 border-t border-gray-600">
            <div className="space-y-2">
              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`
                  w-full flex items-center rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 group relative
                  ${
                    isOpen
                      ? "space-x-3 px-3 py-3"
                      : "justify-center px-3 py-3 mx-1"
                  }
                `}
              >
                <LogOut
                  size={20}
                  className="text-gray-400 group-hover:text-white flex-shrink-0"
                />

                {/* Text label - only show when sidebar is open */}
                {isOpen && (
                  <span className="font-medium whitespace-nowrap">Logout</span>
                )}

                {/* Tooltip for collapsed state on desktop */}
                {!isOpen && !isMobile && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-gray-600 pointer-events-none">
                    Logout
                    {/* Tooltip arrow */}
                    <div className="absolute left-[-4px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-4 border-r-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Toggle Button */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className={`
            fixed top-4 z-40 p-2 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200
            ${isOpen ? "left-72" : "left-20"}
          `}
        >
          <Menu size={16} />
        </button>
      )}
    </>
  );
}
