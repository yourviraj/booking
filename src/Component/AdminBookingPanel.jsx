import React, { useState } from "react";
import emailjs from "emailjs-com"; // EmailJS import

const oneDharamshala = {
  id: 1,
  name: "चंद्रवंशी खाती धर्मशाला बिजलपुर",
  image:
    "https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?q=80&w=2071&auto=format&fit=crop",
  location: "गोपालेशवर महादेव मंदिर",
  owner: "Viraj Patwari",
  contact: "+91-9999999994",
  bookedDates: [
    {
      date: "2025-07-15",
      name: "Ravi",
      phone: "9999999999",
      event: "Wedding",
      email: "ravi@example.com",
    },
    {
      date: "2025-07-18",
      name: "Amit",
      phone: "8888888888",
      event: "Birthday",
      email: "amit@example.com",
    },
  ],
};

const formatDate = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const AdminBookingPanel = () => {
  const [bookedDates, setBookedDates] = useState(oneDharamshala.bookedDates);
  const [selectedToBook, setSelectedToBook] = useState([]);
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [month, setMonth] = useState(new Date());
  const [form, setForm] = useState({ name: "", phone: "", event: "", email: "" });
  const [error, setError] = useState("");

  const isDateBooked = (dateStr) =>
    bookedDates.some((b) => b.date === dateStr);

  const handleDateClick = (dateStr) => {
    const booking = bookedDates.find((b) => b.date === dateStr);
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

  const handleConfirmBooking = () => {
    if (!form.name || !form.phone || !form.event) {
      setError("Please fill all required fields.");
      return;
    }

    if (selectedToBook.length === 0) {
      setError("Please select at least one date to book.");
      return;
    }

    const newBookings = selectedToBook.map((date) => ({
      date,
      name: form.name,
      phone: form.phone,
      event: form.event,
      email: form.email || "",
    }));

    setBookedDates((prev) => [...prev, ...newBookings]);
    setSelectedToBook([]);
    setForm({ name: "", phone: "", event: "", email: "" });
    setError("");

    if (form.email) {
      sendEmail(
        form.email,
        "Your Booking is Confirmed",
        `Dear ${form.name},\n\nYour booking for "${form.event}" on ${selectedToBook.join(
          ", "
        )} has been confirmed.\n\nThank you!`
      );
    }
  };

  const handleConfirmRemoval = () => {
    const removed = bookedDates.filter((b) =>
      selectedToRemove.includes(b.date)
    );
    removed.forEach((b) => {
      if (b.email) {
        sendEmail(
          b.email,
          "Your Booking is Cancelled",
          `Dear ${b.name},\n\nYour booking on ${b.date} for "${b.event}" has been cancelled.`
        );
      }
    });

    setBookedDates((prev) =>
      prev.filter((b) => !selectedToRemove.includes(b.date))
    );
    setSelectedToRemove([]);
    setSelectedDetails(null);
  };

  const downloadCSV = () => {
    const headers = ["Date", "Name", "Phone", "Event", "Email"];
    const rows = bookedDates.map(({ date, name, phone, event, email }) =>
      [date, name, phone, event, email || ""].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bookings.csv");
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

    for (let i = 0; i < firstDay; i++) grid.push(<div key={`empty-${i}`} />);
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

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow mt-6 mb-10">
      <div className="mb-6 flex flex-col md:flex-row gap-6 items-center">
        <img
          src={oneDharamshala.image}
          alt={oneDharamshala.name}
          className="w-full md:w-60 h-40 object-cover rounded-lg shadow"
        />
        <div className="space-y-2 text-gray-700">
          <h2 className="text-2xl font-bold text-orange-600">
            {oneDharamshala.name}
          </h2>
          <p>📍 {oneDharamshala.location}</p>
          <p>👤 {oneDharamshala.owner}</p>
          <p>📞 {oneDharamshala.contact}</p>
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
                setMonth(
                  new Date(parseInt(e.target.value), month.getMonth())
                )
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
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d} className="text-center font-semibold">
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
                📅 Date: <strong>{selectedDetails.date}</strong>
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
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
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
          ["bg-blue-500", "To Book"],
          ["bg-yellow-500", "To Remove"],
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
