import React, { useState } from 'react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login Attempted:", formData);
    // Add backend login API here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('')] bg-cover bg-center">
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-full max-w-sm backdrop-blur-md">
        <h2 className="text-2x1 font-bold text-center text-green-800 font-serif mb-6">
      WELCOME TO BIJALPUR 
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-green-900 font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your mobile number"
              required
            />
          </div>
          <div>
            <label className="block text-green-900 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-sm text-gray-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-xl transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-green-900 mt-4 font-serif">
          Don’t have an account? <a href="#" className="text-green-700 underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
