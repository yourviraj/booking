import React, { useState, useEffect } from "react";
import {
  Users as UsersIcon,
  Phone,
  Search,
  Filter,
  Download,
  UserCheck,
  AlertCircle,
  Shield,
  User,
  Plus,
  X,
  Eye,
  EyeOff,
  Lock,
  Trash2,
  Edit,
} from "lucide-react";
import Axios from "../../Axios";

const Admins = () => {
  const [userdata, setUserdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    role: "admin",
  });

  // Add these after other state declarations
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    contact: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await Axios.get("/admins");
        setUserdata(data);
        setError(null);
      } catch (error) {
        console.error("Cannot fetch data from the backend:", error);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredAndSortedUsers = userdata
    .filter((user) => {
      const matchesSearch =
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.contact?.toString()?.includes(searchTerm);

      const matchesRole = roleFilter === "all" || user?.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const exportToCSV = () => {
    const headers = ["Serial No.", "Name", "Contact No.", "Role", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredAndSortedUsers.map((user, i) =>
        [
          i + 1,
          user?.name || "N/A",
          user?.contact || "N/A",
          user?.role || "user",
          new Date(user?.createdAt).toLocaleDateString() || "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-600" />;
      case "super admin":
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "super admin":
        return "bg-blue-100 text-blue-700";
      case "admin":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const response = await Axios.post("/register", formData);

      // Add the new admin to the local state
      setUserdata([...userdata, response.data]);

      // Reset form and close modal
      setFormData({
        name: "",
        contact: "",
        email: "",
        password: "",
        role: "admin",
      });
      setShowAddForm(false);

      // You can add a success toast here
      alert("Admin added successfully!");
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowAddForm(false);
    setFormData({
      name: "",
      contact: "",
      email: "",
      password: "",
      role: "admin",
    });
    setShowPassword(false);
  };
  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        setDeletingUserId(adminId);
        await Axios.delete(`/admins/${adminId}`);
        // You might want to refresh the data or remove the user from local state here
        // For example: setUsers(users.filter(user => user._id !== adminId));
        alert("Admin deleted successfully!");
      } catch (error) {
        console.error("Error deleting admin:", error);
        alert("Failed to delete admin. Please try again.");
      } finally {
        setDeletingUserId(null);
      }
    }
  };
  const handleUpdateAdmin = (admin) => {
    setSelectedAdmin(admin);
    setUpdateFormData({
      name: admin.name,
      contact: admin.contact,
      email: admin.email,
      role: admin.role,
    });
    setShowUpdateForm(true);
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.put(
        `/admins/${selectedAdmin._id}`,
        updateFormData
      );

      // Update the local state with the updated admin
      setUserdata(
        userdata.map((user) =>
          user._id === selectedAdmin._id ? response.data : user
        )
      );

      // Close modal and reset form
      setShowUpdateForm(false);
      setSelectedAdmin(null);
      setUpdateFormData({
        name: "",
        contact: "",
        email: "",
        role: "",
      });

      alert("Admin updated successfully!");
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("Failed to update admin. Please try again.");
    }
  };

  const closeUpdateModal = () => {
    setShowUpdateForm(false);
    setSelectedAdmin(null);
    setUpdateFormData({
      name: "",
      contact: "",
      email: "",
      role: "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading admins...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading admins
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">All Admins</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Admin
            </button>
          </div>
          <p className="text-gray-600">Manage and view all registered users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">
                  {userdata.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-2xl font-bold text-gray-800">
                  {
                    userdata.filter(
                      (u) => u.role === "admin" || u.role === "super_admin"
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Super Admin Users
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {userdata.filter((u) => u.role === "super admin").length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <User className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users by name or contact..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins</option>
                    <option value="super admin">Super Admins</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-");
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  >
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="role-asc">Role A-Z</option>
                    <option value="role-desc">Role Z-A</option>
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                  </select>
                </div>

                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Serial No.
                  </th>
                  <th
                    className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {sortBy === "name" && (
                        <span className="text-orange-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contact No.
                    </div>
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </div>
                  </th>
                  <th
                    className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Role
                      {sortBy === "role" && (
                        <span className="text-orange-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Joined
                      {sortBy === "createdAt" && (
                        <span className="text-orange-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.length > 0 ? (
                  filteredAndSortedUsers.map((user, i) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 text-gray-600">{i + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {user?.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {user?._id?.slice(-6) || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {user?.contact || "Not provided"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {user?.password || "Not provided"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user?.role)}
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getRoleBadge(
                              user?.role
                            )}`}
                          >
                            {user?.role?.replace("_", " ") || "user"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateAdmin(user)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(user._id)}
                            disabled={deletingUserId === user._id}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            {deletingUserId === user._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      <UsersIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">
                        Try adjusting your search criteria or filters
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm">
          Showing {filteredAndSortedUsers.length} of {userdata.length} users
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-overlay bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Admin
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddAdmin} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Enter contact number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors font-medium"
                >
                  {formSubmitting ? "Adding..." : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Admin Modal */}
      {showUpdateForm && (
        <div className="fixed inset-0 bg-overlay bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Update Admin
                </h2>
                <button
                  onClick={closeUpdateModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={updateFormData.name}
                    onChange={handleUpdateFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={updateFormData.contact}
                    onChange={handleUpdateFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Enter contact number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={updateFormData.email}
                    onChange={handleUpdateFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={updateFormData.role}
                    onChange={handleUpdateFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  >
                    <option value="admin">Admin</option>
                    <option value="super admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
                >
                  Update Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;
