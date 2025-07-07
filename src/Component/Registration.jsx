import React, { useState } from 'react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    // Add your API logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://i.imgur.com/WN7IMzV.jpg')] bg-cover bg-center">
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-green-800 font-serif mb-6">
          Dharmshala ragistration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-900 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-yellow-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-green-900 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-yellow-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-green-900 font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-yellow-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your mobile number"
              required
            />
          </div>
          <div>
            <label className="block text-green-900 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-yellow-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Create a strong password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-xl transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm text-green-900 mt-4 font-serif">
          Already registered? <a href="/login" className="text-green-700 underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
