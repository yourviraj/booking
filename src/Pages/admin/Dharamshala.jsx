import { useState, useEffect } from "react";
import {
  Building,
  MapPin,
  Phone,
  UserCheck,
  Plus,
  Search,
  X,
  Map,
  ChevronDown,
  Upload,
} from "lucide-react";
import DesktopTable from "../../Components/Dharamshala/DesktopTable";
import MobileCard from "../../Components/Dharamshala/MobileCard";
import Axios from "../../Axios";
import { useSelector } from "react-redux";
import imageCompression from 'browser-image-compression';

const DharamshalaManagement = () => {
  const user = useSelector((user) => user.user);
  const [dharamshalas, setDharamshalas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdate, setisUpdate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact: "",
    mapUrl: "",
    owner: "",
    images: [],
  });

  useEffect(() => {
    getDharamshala();
    getAdmins();
  }, []);

  const filteredDharamshalas = dharamshalas.filter(
    (dharamshala) =>
      dharamshala.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dharamshala.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dharamshala.contact.includes(searchTerm) ||
      dharamshala.owner?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      admin.email.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const getAdmins = async () => {
    const { data } = await Axios.get("/admins");

    setAdmins(data);
  };
  const getDharamshala = async () => {
    const id = window.localStorage.getItem("id");
    if (!id) return;
    const { data } = await Axios.get(`/venues?id=${id}`);
    setDharamshalas(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getSelectedAdmin = () => {
    return admins.find((admin) => admin._id === formData.owner);
  };

  const handleAdminSelect = (adminId) => {
    setFormData((prev) => ({
      ...prev,
      owner: adminId,
    }));
    setShowAdminDropdown(false);
    setAdminSearch("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.location ||
      !formData.contact ||
      !formData.owner
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate contact format
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(formData.contact)) {
      alert("Please enter contact number in format: +91-XXXXXXXXXX");
      return;
    }
    let res;
    if (isUpdate) {
      res = await Axios.put("/venues", formData);
    } else {
      res = await Axios.post("/venues", formData);
    }
    if (res.data) {
      getDharamshala();
    }
    // Reset form
    setFormData({
      name: "",
      location: "",
      contact: "",
      mapUrl: "",
      owner: "",
      images: [],
    });
    setShowAddModal(false);

    alert("Dharamshala Updated successfully!");
  };

  const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files);

  // Check if adding new images would exceed the limit
  if (formData.images.length + files.length > 10) {
    alert("You can upload a maximum of 10 images");
    return;
  }

  setIsUploading(true);

  try {
    const compressedUploads = files.map(async (file) => {
      // Compress image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1, // Target size (adjust if needed)
        maxWidthOrHeight: 1920, // Resize if larger
        useWebWorker: true,
      });

      // Prepare upload form
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "dharamshala_preset");
      formData.append("cloud_name", "djpopvpp0");

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/djpopvpp0/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    });

    const uploadedUrls = await Promise.all(compressedUploads);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
  } catch (error) {
    console.error("Error uploading images:", error);
    alert("Error uploading images. Please try again.");
  } finally {
    setIsUploading(false);
  }
};

  // Remove image from the list
  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Building className="w-8 h-8 text-orange-500" />
                Dharamshala Management
              </h1>
              <p className="text-gray-600">
                Manage dharamshala venues and bookings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-600">
                <Building className="w-4 h-4" />
                <span className="font-medium">
                  {filteredDharamshalas.length} Dharamshalas
                </span>
              </div>
              {user.role === "super admin" && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Dharamshala
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search dharamshalas by name, location, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <DesktopTable
          filteredDharamshalas={filteredDharamshalas}
          setShowAddModal={setShowAddModal}
          setFormData={setFormData}
          setisUpdate={setisUpdate}
          getDharamshala={getDharamshala}
        />

        {/* Mobile Card View */}
        <MobileCard filteredDharamshalas={filteredDharamshalas} />

        {/* Empty State */}
        {filteredDharamshalas.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No dharamshalas found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Get started by adding your first dharamshala"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add First Dharamshala
              </button>
            )}
          </div>
        )}

        {/* Add Dharamshala Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-overlay bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-orange-500" />
                  {isUpdate ? "Update Dharamshala" : "Add New Dharamshala"}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Dharamshala Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter dharamshala name"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter location"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="+91-XXXXXXXXXX"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Format: +91-XXXXXXXXXX
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Map URL (Optional)
                    </label>
                    <div className="relative">
                      <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="url"
                        name="mapUrl"
                        value={formData.mapUrl}
                        onChange={handleInputChange}
                        placeholder="https://maps.google.com/..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Google Maps or any map service URL
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Images * (Min: 1, Max: 10)
                      </label>
                      <span className="text-sm text-gray-500">
                        {formData.images.length}/10 images
                      </span>
                    </div>

                    {/* Upload Button */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        {isUploading ? "Uploading..." : "Upload Images"}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading || formData.images.length >= 10}
                        />
                      </label>
                      {isUploading && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                          Uploading images...
                        </div>
                      )}
                    </div>

                    {/* Image Preview Grid */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={image}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Instructions */}
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">
                        Image Upload Instructions:
                      </p>
                      <ul className="space-y-1">
                        <li>• Upload at least 1 image (required)</li>
                        <li>• Maximum 10 images allowed</li>
                        <li>• Supported formats: JPG, PNG, GIF</li>
                        <li>
                          • Make sure to replace 'your_cloud_name' and
                          'your_upload_preset' with your actual Cloudinary
                          credentials
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Admin *
                    </label>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                      <div
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 cursor-pointer bg-white"
                        onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                      >
                        {formData.owner ? (
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">
                                {getSelectedAdmin()?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {getSelectedAdmin()?.email}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Select an admin</span>
                        )}
                      </div>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

                      {showAdminDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                placeholder="Search admins..."
                                value={adminSearch}
                                onChange={(e) => setAdminSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div className="max-h-40 overflow-y-auto">
                            {loadingAdmins ? (
                              <div className="p-4 text-center text-gray-500">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                                <p className="mt-2">Loading admins...</p>
                              </div>
                            ) : filteredAdmins.length > 0 ? (
                              filteredAdmins.map((admin) => (
                                <div
                                  key={admin._id}
                                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  onClick={() => handleAdminSelect(admin._id)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                      <UserCheck className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {admin.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {admin.email}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                No admins found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Selection */}

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    {isUpdate ? "Update Dharamshala" : "Add Dharamshala"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DharamshalaManagement;
