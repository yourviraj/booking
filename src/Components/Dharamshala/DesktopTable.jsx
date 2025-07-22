import { Phone, Trash2, Calendar, MapPin, Edit, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../../Axios";

const DesktopTable = ({
  filteredDharamshalas,
  setShowAddModal,
  setFormData,
  setisUpdate,
  getDharamshala,
  loading
}) => {
  const user = useSelector((user) => user.user);

  const navigate = useNavigate();

  const handleDeleteDharamshala = async (e, id) => {
    e.stopPropagation();

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
    e.stopPropagation(); // Prevent the row click event from firing

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

  // Loading skeleton row component
  const LoadingRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </td>
      {user.role === "super admin" && (
        <td className="px-6 py-4">
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </td>
      )}
    </tr>
  );

  // Empty state component
  const EmptyState = () => (
    <tr>
      <td colSpan={user.role === "super admin" ? 5 : 4} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-gray-500">
            <p className="text-sm font-medium">No dharamshalas found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria</p>
          </div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Dharamshala Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Bookings
              </th>
              {user.role === "super admin" && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              // Show loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <LoadingRow key={`loading-${index}`} />
              ))
            ) : filteredDharamshalas.length === 0 ? (
              // Show empty state when no data
              <EmptyState />
            ) : (
              // Show actual data
              filteredDharamshalas.map((dharamshala, index) => (
                <tr
                  key={dharamshala._id}
                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() =>
                    navigate(`/admin/dharamshala/booking/${dharamshala._id}`)
                  }
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={dharamshala.images[0] || "/api/placeholder/48/48"}
                          alt="Dharamshala"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {dharamshala.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {dharamshala.location}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {dharamshala.contact}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 font-medium flex">
                          {dharamshala.bookedDates?.length || 0} Booked
                        </span>
                      </div>
                    </div>
                  </td>

                  {user.role === "super admin" && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleEditDharamshala(e, dharamshala)}
                          className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={(e) =>
                            handleDeleteDharamshala(e, dharamshala._id)
                          }
                          className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Optional: Loading overlay for the entire table */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Loading dharamshalas...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopTable;