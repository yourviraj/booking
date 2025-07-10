import React, { useState } from "react";

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
    },
    {
      date: "2025-07-18",
      name: "Amit",
      phone: "8888888888",
      event: "Birthday",
    },
  ],
};

const formatDate = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const AdminBookingPanel = () => {
  const [bookedDates, setBookedDates] = useState(oneDharamshala.bookedDates);
  const [selectedToBook, setSelectedToBook] = useState([]);
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  const [month, setMonth] = useState(new Date());

  const [form, setForm] = useState({ name: "", phone: "", event: "" });
  const [error, setError] = useState("");

  const isDateBooked = (dateStr) => bookedDates.some((b) => b.date === dateStr);

  const handleDateClick = (dateStr) => {
    if (isDateBooked(dateStr)) {
      if (selectedToRemove.includes(dateStr)) {
        setSelectedToRemove((prev) => prev.filter((d) => d !== dateStr));
      } else {
        setSelectedToRemove((prev) => [...prev, dateStr]);
      }
    } else {
      if (selectedToBook.includes(dateStr)) {
        setSelectedToBook((prev) => prev.filter((d) => d !== dateStr));
      } else {
        setSelectedToBook((prev) => [...prev, dateStr]);
      }
    }
  };

  const handleConfirmBooking = () => {
    if (!form.name || !form.phone || !form.event) {
      setError("Please fill all fields before booking.");
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
    }));

    setBookedDates((prev) => [...prev, ...newBookings]);
    setSelectedToBook([]);
    setForm({ name: "", phone: "", event: "" });
    setError("");
  };

  const handleConfirmRemoval = () => {
    setBookedDates((prev) => prev.filter((b) => !selectedToRemove.includes(b.date)));
    setSelectedToRemove([]);
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
          className={`p-2 text-white text-center rounded cursor-pointer ${bg}`}
        >
          {d}
        </div>
      );
    }

    return grid;
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mt-6 mb-10">
      {/* Dharamshala Info */}
      <div className="mb-6 flex flex-col md:flex-row gap-6 items-center">
        <img
          src={oneDharamshala.image}
          alt={oneDharamshala.name}
          className="w-full md:w-60 h-40 object-cover rounded-lg shadow"
        />
        <div className="space-y-2 text-gray-700">
          <h2 className="text-2xl font-bold text-orange-600">{oneDharamshala.name}</h2>
          <p>📍 {oneDharamshala.location}</p>
          <p>👤 {oneDharamshala.owner}</p>
          <p>📞 {oneDharamshala.contact}</p>
        </div>
      </div>

      {/* Month and Year Selectors */}
      <div className="flex justify-between items-center mb-2">
        <select
          value={month.getMonth()}
          onChange={(e) =>
            setMonth(new Date(month.getFullYear(), parseInt(e.target.value)))
          }
          className="p-1 border rounded"
        >
          {Array.from({ length: 12 }).map((_, idx) => (
            <option key={idx} value={idx}>
              {new Date(0, idx).toLocaleString("default", { month: "long" })}
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

      {/* Calendar */}
      <h3 className="text-xl font-semibold mb-2">🗓️ Booking Calendar</h3>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="text-center font-semibold">
            {d}
          </div>
        ))}
        {renderCalendar()}
      </div>

      {/* Booking Form */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Event"
          className="w-full p-2 border rounded"
          value={form.event}
          onChange={(e) => setForm({ ...form, event: e.target.value })}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Buttons */}
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

      {/* Legend */}
      <div className="flex justify-between text-sm mt-6 text-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" /> <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" /> <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" /> <span>To Book</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded" /> <span>To Remove</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">📋 Booked Dates:</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          {bookedDates.map((b, idx) => (
            <li key={idx}>
              🗓️ {b.date} — {b.name} ({b.phone}) — {b.event}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminBookingPanel;