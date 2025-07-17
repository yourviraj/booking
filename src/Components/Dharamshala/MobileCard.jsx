import { Phone, Trash2, MapPin, Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MobileCard = ({ filteredDharamshalas }) => {
  const user = useSelector((user) => user.user);
  const navigate = useNavigate();

  const handleDeleteDharamshala = (e, id) => {
    e.stopPropagation(); // Prevent the card click event from firing

    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this dharamshala? This action cannot be undone."
    );

    if (confirmed) {
      // Add your delete logic here
      console.log("Deleting dharamshala with ID:", id);

      // Example: Call delete API
      // try {
      //   await Axios.delete(`/dharamshalas/${id}`);
      //   // Refresh the list or remove from state
      //   alert("Dharamshala deleted successfully!");
      // } catch (error) {
      //   alert("Failed to delete dharamshala. Please try again.");
      // }
    }
  };

  return (
    <div className="lg:hidden space-y-4">
      {filteredDharamshalas.map((dharamshala, index) => (
        <div
          key={dharamshala._id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
          onClick={() =>
            navigate(`/admin/dharamshala/booking/${dharamshala._id}`)
          }
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
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
                <div className="text-sm text-gray-500">
                  ID: #{dharamshala._id}
                </div>
              </div>
            </div>
            {user.role === "super admin" && (
              <button
                onClick={(e) => handleDeleteDharamshala(e, dharamshala._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-gray-900">
                {dharamshala.location}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Contact:</span>
              <span className="font-medium text-gray-900">
                {dharamshala.contact}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">
                  {dharamshala.availableDates?.length || 0} Available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-medium">
                  {dharamshala.bookedDates?.length || 0} Booked
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileCard;