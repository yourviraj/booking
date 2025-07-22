import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  Store,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUp,
  ArrowDown,
  UserCheck,
  Shield,
} from "lucide-react";
import Axios from "../../Axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [series, setSeries] = useState([]);
  const [month, setMonth] = useState([]);
  const [dharamshalaStats, setDharamshalaStats] = useState({
    totalDharamshalas: 0,
    totalBookings: 0,
    totalAdmins: 0,
    totalSuperAdmins: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.user);

  const fetchDharamshalaStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch dharamshala dashboard statistics
      const { data } = await Axios.get("/admin/dashboard");
      setDharamshalaStats(data);

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role === "super admin") {
      fetchDharamshalaStats();
    }
  }, [role]);

  // Calculate growth rate for bookings (placeholder since we don't have historical data)
  const calculateGrowth = () => {
    // Since we don't have historical data, return a placeholder
    // You can implement this when you add monthly booking trends
    return "5.2";
  };

  // Stats cards configuration
  const statsCards = [
    {
      title: "Total Bookings",
      value: dharamshalaStats.totalBookings,
      icon: ShoppingCart,
      color: "bg-blue-500",
      change: calculateGrowth(),
      changeType: calculateGrowth() >= 0 ? "increase" : "decrease",
    },
    {
      title: "Total Dharamshalas",
      value: dharamshalaStats.totalDharamshalas,
      icon: Store,
      color: "bg-orange-500",
      change: "2.5",
      changeType: "increase",
    },
    {
      title: "Total Admins",
      value: dharamshalaStats.totalAdmins,
      icon: Users,
      color: "bg-green-500",
      change: "5.0",
      changeType: "increase",
    },
    {
      title: "Super Admins",
      value: dharamshalaStats.totalSuperAdmins,
      icon: Shield,
      color: "bg-purple-500",
      change: "0",
      changeType: "increase",
    },
  ];

  // Calculate average bookings per dharamshala
  const averageBookings = dharamshalaStats.totalDharamshalas > 0 
    ? (dharamshalaStats.totalBookings / dharamshalaStats.totalDharamshalas).toFixed(1)
    : 0;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm h-96">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm h-96">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dharamshala Management Dashboard
              </h1>
              <p className="text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="text-sm text-gray-500">Welcome back,</span>
                <p className="font-semibold text-gray-900">
                  {user?.name || "Super Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {card.changeType === "increase" ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        card.changeType === "increase"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {card.change}%
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {typeof card.value === "number" && card.value > 999
                      ? card.value.toLocaleString()
                      : card.value}
                  </h3>
                  <p className="text-gray-600 text-sm">{card.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Booking Rate
                </h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {averageBookings}
                </p>
                <p className="text-sm text-gray-600">
                  Average bookings per dharamshala
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Admin Ratio
                </h3>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {dharamshalaStats.totalDharamshalas > 0 
                    ? (dharamshalaStats.totalDharamshalas / dharamshalaStats.totalAdmins).toFixed(1)
                    : 0}
                </p>
                <p className="text-sm text-gray-600">
                  Dharamshalas per admin
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  System Status
                </h3>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  Active
                </p>
                <p className="text-sm text-gray-600">
                  All systems operational
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/dharamshala"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <Store className="w-6 h-6 text-orange-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                View Dharamshala
              </span>
            </Link>
            
            {/* <Link
              to="/admin/bookings"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-orange-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                View Bookings
              </span>
            </Link> */}

            {/* <Link
              to="/admin/manage-dharamshalas"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <Package className="w-6 h-6 text-orange-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Manage Dharamshalas
              </span>
            </Link> */}
            
            <Link
              to="/admin/admins"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <Users className="w-6 h-6 text-orange-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                View Admins
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;