import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { role, page_loading } = useSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if current screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!page_loading) {
      if (role === "admin" || role === "super admin") {
        // User is authorized
      } else {
        navigate("/");
      }
    }
  }, [page_loading, role, navigate]);

  if (page_loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={`
        transition-all duration-300 ease-in-out
        ${isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-16"}
      `}
      >
        {/* Content Area */}
        <div className="min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
