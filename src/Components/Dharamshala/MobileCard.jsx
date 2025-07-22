import { Phone, Trash2, MapPin, Calendar, Edit, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../../Axios";

const MobileCard = ({
  filteredDharamshalas,
  setShowAddModal,
  setFormData,
  setisUpdate,
  getDharamshala,
  loading,
}) => {
  const user = useSelector((user) => user.user);
  const navigate = useNavigate();

  const handleDeleteDharamshala = async (e, id) => {
    e.stopPropagation(); // Prevent the card click event from firing

    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this dharamshala? This action cannot be undone."
    );

    if (confirmed) {
      try {
        await Axios.delete(`/venues/${id}`);
        getDharamshala();
        alert("Dharamshala deleted successfully!");
      } catch (error) {
        alert("Failed to delete dharamshala. Please try again.");
      }
    }
  };

  const handleEditDharamshala = (e, dharamshala) => {
    e.stopPropagation(); // Prevent the card click event from firing

    // Set the form data with the dharamshala data for editing
    setFormData({
      _id: dharamshala._id,
      name: dharamshala.name,
      location: dharamshala.location,
      contact: dharamshala.contact,
      images: dharamshala.images,
      bookedDates: dharamshala.bookedDates,
      owner: dharamshala.owner,
    });

    // Show the modal
    setShowAddModal(true);
    setisUpdate(dharamshala._id);
  };

  // Loading skeleton card component
  const LoadingCard = ({ index }) => (
    <div
      key={`loading-${index}`}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 animate-pulse"
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-200 flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        {user.role === "super admin" && (
          <div className="flex gap-1 sm:gap-2 ml-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="space-y-3">
        {/* Location */}
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded mt-0.5 flex-shrink-0"></div>
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>

        {/* Bookings Section */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>

      {/* Mobile action buttons skeleton */}
      {user.role === "super admin" && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 sm:hidden">
          <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      )}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <MapPin className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Dharamshalas Found
      </h3>
      <p className="text-gray-500 text-sm">
        Try adjusting your search criteria or add a new dharamshala.
      </p>
    </div>
  );

  // Loading state with spinner
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-sm border">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="text-sm font-medium text-gray-700">Loading dharamshalas...</span>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden space-y-3 px-2 sm:px-4 relative">
      {loading ? (
        <>
          {/* Show loading spinner at the top */}
          <LoadingSpinner />
          {/* Show skeleton cards */}
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingCard key={`loading-${index}`} index={index} />
          ))}
        </>
      ) : filteredDharamshalas.length === 0 ? (
        <EmptyState />
      ) : (
        filteredDharamshalas.map((dharamshala, index) => (
          <div
            key={dharamshala._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
            onClick={() =>
              navigate(`/admin/dharamshala/booking/${dharamshala._id}`)
            }
          >
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={dharamshala.images[0] || "/api/placeholder/48/48"}
                    alt="Dharamshala"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    {dharamshala.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">
                    ID: #{dharamshala._id.slice(-6)}
                  </div>
                </div>
              </div>

              {/* Action buttons for super admin */}
              {user.role === "super admin" && (
                <div className="flex gap-1 sm:gap-2 ml-2">
                  <button
                    onClick={(e) => handleEditDharamshala(e, dharamshala)}
                    className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Dharamshala"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteDharamshala(e, dharamshala._id)}
                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Dharamshala"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-3">
              {/* Location */}
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-gray-900 ml-1 break-words">
                    {dharamshala.location}
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">Contact:</span>
                <a
                  href={`tel:${dharamshala.contact}`}
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {dharamshala.contact}
                </a>
              </div>

              {/* Bookings Section */}
              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="text-red-600 font-medium">
                    {dharamshala.bookedDates?.length || 0} Booked
                  </span>
                </div>

                {/* Optional: Add available dates if you have that data */}
                {dharamshala.availableDates && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">
                      {dharamshala.availableDates?.length || 0} Available
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile-specific action buttons at bottom (alternative layout) */}
            {user.role === "super admin" && (
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 sm:hidden">
                <button
                  onClick={(e) => handleEditDharamshala(e, dharamshala)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => handleDeleteDharamshala(e, dharamshala._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* Optional: Loading overlay for the entire container */}
      {loading && (
        <div className="absolute bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg border">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Refreshing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileCard;