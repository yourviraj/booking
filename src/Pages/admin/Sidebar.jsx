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
    // {
    //   icon: ShoppingCart,
    //   label: "Booking",
    //   path: "/admin/booking",
    //   roles: ["admin", "super admin"],
    // },
    // {
    //   icon: Package,
    //   label: "Products",
    //   path: "/admin/products",
    //   roles: ["admin", "shop"],
    // },
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
          <div className="flex items-center justify-between p-4 border-b border-gray-600">
            <Link
              to="/"
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 md:opacity-100"
              }`}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-white text-xl p-1">
                <img src="/logo.png" alt="" />
              </div>
              {isOpen && (
                <div className="text-xl font-bold text-white">Bijalpursewa</div>
              )}
            </Link>

            {isMobile && isOpen && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
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
                        flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
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
                          transition-transform duration-200 group-hover:scale-110
                          ${
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-white"
                          }
                        `}
                      />
                      {(isOpen || (!isMobile && !isOpen)) && (
                        <span
                          className={`
                          font-medium transition-opacity duration-300
                          ${isOpen ? "display-flex" : "hidden"}
                        `}
                        >
                          {item.label}
                        </span>
                      )}

                      {/* Tooltip for collapsed state on desktop */}
                      {!isOpen && !isMobile && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg border border-gray-600">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-600">
            <div className="space-y-2">
              {/* Profile */}
              <Link
                to="/admin/profile"
                onClick={() => isMobile && setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                  ${
                    isActiveRoute("/admin/profile")
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                {user?.profilepic ? (
                  <img
                    src={user.profilepic}
                    alt="Profile"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User
                    size={20}
                    className="text-gray-400 group-hover:text-white"
                  />
                )}
                {(isOpen || (!isMobile && !isOpen)) && (
                  <span
                    className={`
                    font-medium transition-opacity duration-300
                    ${isOpen ? "opacity-100" : "opacity-0 md:opacity-0"}
                  `}
                  >
                    Profile
                  </span>
                )}

                {!isOpen && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg border border-gray-600">
                    Profile
                  </div>
                )}
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 group relative"
              >
                <LogOut
                  size={20}
                  className="text-gray-400 group-hover:text-white"
                />
                {(isOpen || (!isMobile && !isOpen)) && (
                  <span
                    className={`
                    font-medium transition-opacity duration-300
                    ${isOpen ? "opacity-100" : "opacity-0 md:opacity-0"}
                  `}
                  >
                    Logout
                  </span>
                )}

                {!isOpen && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-dark text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg border border-gray-600">
                    Logout
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
            fixed top-4 z-40 p-2 bg-[#ffffffb8] border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200
            ${isOpen ? "left-72" : "left-20"}
          `}
        >
          <Menu size={16} />
        </button>
      )}
    </>
  );
}
