import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com"; // EmailJS import
import { useParams } from "react-router-dom";
import Axios from "../../Axios";
import ImageSlider from "../../Components/Booking/ImageSlider";

const formatDate = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const AdminBookingPanel = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const sendEmail = (to, subject, message) => {
    if (!to) return;

    const templateParams = {
      to_email: to,
      subject,
      message,
    };

    emailjs
      .send(
        "your_service_id", // Replace with your actual service ID
        "your_template_id", // Replace with your template ID
        templateParams,
        "your_user_id" // Replace with your user/public key
      )
      .then((res) => console.log("📧 Email sent", res))
      .catch((err) => console.error("❌ Email failed", err));
  };

  const handleConfirmBooking = async () => {
    if (!form.name || !form.phone || !form.event) {
      setError("Please fill all required fields.");
      return;
    }

    if (selectedToBook.length === 0) {
      setError("Please select at least one date to book.");
      return;
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // Validate email format if provided
    if (form.email && !/.+@.+\..+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const newBookings = selectedToBook.map((date) => ({
        date: date,
        name: form.name,
        phone: form.phone,
        event: form.event,
        email: form.email || "",
      }));

      // Send booking request to backend

      const { data } = await Axios.post(`/venues/${id}/book`, {
        bookings: newBookings,
      });

      // Update local state with the updated venue data
      if (data) {
        fetchVenue();
      }
      setSelectedToBook([]);
      setForm({ name: "", phone: "", event: "", email: "" });
      setError("");

      // Send confirmation email
      if (form.email) {
        sendEmail(
          form.email,
          "Your Booking is Confirmed",
          `Dear ${form.name},\n\nYour booking for "${
            form.event
          }" on ${selectedToBook.join(", ")} has been confirmed.\n\nThank you!`
        );
      }

      alert("Booking confirmed successfully!");
    } catch (err) {
      setError("Failed to confirm booking. Please try again.");
      console.error("Error confirming booking:", err);
    }
  };

  const handleConfirmRemoval = async () => {
    if (!venue?.bookedDates) return;

    try {
      const bookingsToRemove = venue.bookedDates.filter((b) => {
        const bookingDate = new Date(b.date).toISOString().split("T")[0];
        return selectedToRemove.includes(bookingDate);
      });

      // Send cancellation emails before removing
      // bookingsToRemove.forEach((b) => {
      //   if (b.email) {
      //     const bookingDate = new Date(b.date).toISOString().split("T")[0];
      //     sendEmail(
      //       b.email,
      //       "Your Booking is Cancelled",
      //       `Dear ${b.name},\n\nYour booking on ${bookingDate} for "${b.event}" has been cancelled.`
      //     );
      //   }
      // });

      // Send removal request to backend
      console.log({ dates: selectedToRemove });

      const { data } = await Axios.post(`/venues/${id}/remove-book`, {
        dates: selectedToRemove,
      });

      // Update local state
      if (data) {
        fetchVenue();
      }
      setSelectedToRemove([]);
      setSelectedDetails(null);

      alert("Booking(s) removed successfully!");
    } catch (err) {
      setError("Failed to remove booking. Please try again.");
      console.error("Error removing booking:", err);
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
      <div className="mb-6 flex flex-col md:flex-row gap-6 items-center  w-1/2">
        <ImageSlider images={venue.images || []} />
        <div className="space-y-2 text-gray-700">
          <h2 className="text-2xl font-bold text-orange-600">{venue.name}</h2>
          <p>📍 {venue.location}</p>
          <p>👤 Owner ID: {venue?.owner?.name || venue?.owner}</p>
          <p>📞 {venue.contact}</p>
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
        >
          Confirm Booking ({selectedToBook.length})
        </button>
      )}
      {selectedToRemove.length > 0 && (
        <button
          onClick={handleConfirmRemoval}
          className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
        >
          Remove Booking ({selectedToRemove.length})
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
    </div>
  );
};

export default AdminBookingPanel;
