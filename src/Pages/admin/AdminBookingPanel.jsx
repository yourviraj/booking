import  { useState, useEffect } from "react";

import {  useParams } from "react-router-dom";
import Axios from "../../Axios";
import ImageSlider from "../../Components/Booking/ImageSlider";
import InventoryTable from "../../Components/Booking/Inventory";

const formatDate = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const AdminBookingPanel = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [removalLoading, setRemovalLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedToBook, setSelectedToBook] = useState([]);
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [month, setMonth] = useState(new Date());
  const [form, setForm] = useState({
    name: "",
    phone: "",
    event: "",
    email: "",
  });

  // Fetch venue data from backend
  const fetchVenue = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`/venues/${id}`);
      setVenue(response.data);
      setInventory(response.data.inventory);
      setError("");
    } catch (err) {
      setError("Failed to fetch venue data");
      console.error("Error fetching venue:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchVenue();
    }
  }, [id]);

  const isDateBooked = (dateStr) => {
    if (!venue?.bookedDates) return false;
    return venue.bookedDates.some((booking) => {
      const bookingDate = new Date(booking.date).toISOString().split("T")[0];
      return bookingDate === dateStr;
    });
  };

  const handleDateClick = (dateStr) => {
    if (!venue?.bookedDates) return;

    const booking = venue.bookedDates.find((b) => {
      const bookingDate = new Date(b.date).toISOString().split("T")[0];
      return bookingDate === dateStr;
    });

    if (booking) {
      setSelectedDetails(booking);
      setSelectedToRemove((prev) =>
        prev.includes(dateStr)
          ? prev.filter((d) => d !== dateStr)
          : [...prev, dateStr]
      );
    } else {
      setSelectedDetails(null);
      setSelectedToBook((prev) =>
        prev.includes(dateStr)
          ? prev.filter((d) => d !== dateStr)
          : [...prev, dateStr]
      );
    }
  };

  const handleConfirmBooking = async () => {
    // Validate form fields
    const requiredFields = ["name", "phone", "event"];
    const missingFields = requiredFields.filter(
      (field) => !form[field]?.trim()
    );

    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(", ")}`);
      return;
    }

    if (selectedToBook.length === 0) {
      setError("Please select at least one date to book.");
      return;
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // Validate email format if provided
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setBookingLoading(true);
      const newBookings = selectedToBook.map((date) => ({
        date: date,
        name: form.name.trim(),
        phone: form.phone.trim(),
        event: form.event.trim(),
        email: form.email?.trim() || "",
      }));

      // Send booking request to backend
      const { data } = await Axios.post(`/venues/${id}/book`, {
        bookings: newBookings,
      });

      // Update local state with the updated venue data
      if (data) {
        await fetchVenue(); // Ensure venue data is refreshed
      }

      // Reset form and selections
      setSelectedToBook([]);
      setForm({ name: "", phone: "", event: "", email: "" });
      setError("");

      alert("Booking confirmed successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to confirm booking. Please try again.";
      setError(errorMessage);
      console.error("Error confirming booking:", err);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleConfirmRemoval = async () => {
    if (!venue?.bookedDates || selectedToRemove.length === 0) {
      setError(
        selectedToRemove.length === 0
          ? "Please select at least one booking to remove"
          : "No bookings available to remove"
      );
      return;
    }

    try {
      // Confirm with user before deletion
      const isConfirmed = window.confirm(
        `Are you sure you want to remove ${selectedToRemove.length} booking(s)?\n\n` +
          `Selected dates: ${selectedToRemove.join(", ")}`
      );

      if (!isConfirmed) return;

      setRemovalLoading(true);

      const bookingsToRemove = venue.bookedDates.filter((b) => {
        const bookingDate = new Date(b.date).toISOString().split("T")[0];
        return selectedToRemove.includes(bookingDate);
      });

      // Additional validation - ensure we found matching bookings
      if (bookingsToRemove.length !== selectedToRemove.length) {
        const missingDates = selectedToRemove.filter(
          (date) =>
            !bookingsToRemove.some(
              (b) => new Date(b.date).toISOString().split("T")[0] === date
            )
        );
        setError(`Some bookings couldn't be found: ${missingDates.join(", ")}`);
        return;
      }

      // Send removal request to backend
      const { data } = await Axios.post(`/venues/${id}/remove-book`, {
        dates: selectedToRemove,
        // Include additional context if needed by backend
        removedBy: "admin", // or user ID/name
        timestamp: new Date().toISOString(),
      });

      // Update local state
      if (data) {
        await fetchVenue(); // Ensure we wait for the refresh
      }

      // Reset selections
      setSelectedToRemove([]);
      setSelectedDetails(null);
      setError("");

      // Show success message with details
      alert(
        `Successfully removed ${
          bookingsToRemove.length
        } booking(s):\n${selectedToRemove.join("\n")}`
      );

      // Optional: Send notification emails to affected users
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to remove booking(s). Please try again.";
      setError(errorMessage);
      console.error("Error removing booking:", err);

      // Optionally show more detailed error in development
      if (process.env.NODE_ENV === "development") {
        console.debug("Error details:", {
          selectedToRemove,
          venueId: id,
          error: err.response?.data,
        });
      }
    } finally {
      setRemovalLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!venue?.bookedDates?.length) {
      alert("No bookings to download.");
      return;
    }

    const headers = ["Date", "Name", "Phone", "Event", "Email"];
    const rows = venue.bookedDates.map(
      ({ date, name, phone, event, email }) => {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        return [formattedDate, name, phone, event, email || ""].join(",");
      }
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${venue.name}_bookings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCalendar = () => {
    const year = month.getFullYear();
    const m = month.getMonth();
    const firstDay = new Date(year, m, 1).getDay();
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const grid = [];

    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-${i}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDate(year, m, d);
      const isBooked = isDateBooked(dateStr);
      const isSelectedToBook = selectedToBook.includes(dateStr);
      const isSelectedToRemove = selectedToRemove.includes(dateStr);

      let bg = "bg-green-500";
      if (isBooked) bg = "bg-red-500";
      if (isSelectedToBook) bg = "bg-blue-600";
      if (isSelectedToRemove) bg = "bg-yellow-500";

      grid.push(
        <div
          key={d}
          onClick={() => handleDateClick(dateStr)}
          className={`p-2 text-white text-center rounded cursor-pointer text-sm font-bold ${bg}`}
        >
          {d}
        </div>
      );
    }

    return grid;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow mt-6 mb-10">
        <div className="text-center">Loading venue data...</div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow mt-6 mb-10">
        <div className="text-center text-red-500">
          {error || "Venue not found"}
        </div>
      </div>
    );
  }





  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow mt-6 mb-10">
      
      <div className="md:flex flex-row items-start gap-4">
        <div className="mb-6 flex flex-col md:flex-row gap-6  w-2/3">
          <ImageSlider images={venue.images || []} />
          <div className="space-y-2 text-gray-700">
            <h2 className="text-2xl font-bold text-orange-600">{venue.name}</h2>
            <p>📍 {venue.location}</p>
            <p>👤 Owner ID: {venue?.owner?.name || venue?.owner}</p>
            <p>📞 {venue.contact}</p>
          </div>
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <select
              value={month.getMonth()}
              onChange={(e) =>
                setMonth(
                  new Date(month.getFullYear(), parseInt(e.target.value))
                )
              }
              className="p-1 border rounded"
            >
              {Array.from({ length: 12 }).map((_, idx) => (
                <option key={idx} value={idx}>
                  {new Date(0, idx).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
            <select
              value={month.getFullYear()}
              onChange={(e) =>
                setMonth(new Date(parseInt(e.target.value), month.getMonth()))
              }
              className="p-1 border rounded"
            >
              {Array.from({ length: 101 }, (_, i) => 2000 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <h3 className="text-xl font-semibold mb-2">🗓️ Booking Calendar</h3>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="text-center font-semibold">
                {d}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>

        <div className="border rounded-lg p-4 h-fit shadow text-sm bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">📋 Booking Details</h3>
          {selectedDetails ? (
            <ul className="space-y-1">
              <li>
                📅 Date:{" "}
                <strong>
                  {new Date(selectedDetails.date).toISOString().split("T")[0]}
                </strong>
              </li>
              <li>👤 Name: {selectedDetails.name}</li>
              <li>📞 Phone: {selectedDetails.phone}</li>
              <li>🎉 Event: {selectedDetails.event}</li>
              {selectedDetails.email && (
                <li>✉️ Email: {selectedDetails.email}</li>
              )}
            </ul>
          ) : (
            <p className="text-gray-500">
              Click a red date to view booking details.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between text-sm mt-6 text-gray-700">
        {[
          ["bg-green-500", "Available"],
          ["bg-red-500", "Booked"],
          ["bg-blue-500", "Book"],
          ["bg-yellow-500", "Remove"],
        ].map(([color, label]) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-3 h-3 ${color} rounded`} /> <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 my-6">
        {["name", "phone", "event", "email"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">
              {field === "email"
                ? "✉️ Email (optional)"
                : field === "name"
                ? "👤 Name"
                : field === "phone"
                ? "📞 Phone"
                : "🎉 Event"}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              className="w-full p-2 border rounded"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              name={field}
              placeholder={
                field === "phone"
                  ? "Enter 10-digit phone number"
                  : field === "email"
                  ? "Enter email address"
                  : `Enter ${field}`
              }
            />
          </div>
        ))}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {selectedToBook.length > 0 && (
        <button
          onClick={handleConfirmBooking}
          disabled={bookingLoading}
          className={`w-full py-2 rounded mb-2 text-white transition-colors ${
            bookingLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {bookingLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Confirming Booking...
            </span>
          ) : (
            `Confirm Booking (${selectedToBook.length})`
          )}
        </button>
      )}

      {selectedToRemove.length > 0 && (
        <button
          onClick={handleConfirmRemoval}
          disabled={removalLoading}
          className={`w-full py-2 rounded transition-colors text-white ${
            removalLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-600 hover:bg-yellow-700"
          }`}
        >
          {removalLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Removing Booking...
            </span>
          ) : (
            `Remove Booking (${selectedToRemove.length})`
          )}
        </button>
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={downloadCSV}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          📥 Download Bookings CSV
        </button>
      </div>

      <InventoryTable inventory={inventory} setInventory={setInventory} />
    </div>
  );
};

export default AdminBookingPanel;
