import { Phone, Trash2, Calendar, MapPin, Edit } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../../Axios";

const DesktopTable = ({
  filteredDharamshalas,
  setShowAddModal,
  setFormData,
  setisUpdate,
  getDharamshala,
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
            {filteredDharamshalas.map((dharamshala, index) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DesktopTable;
