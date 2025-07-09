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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Village Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%2387CEEB;stop-opacity:1" /><stop offset="100%" style="stop-color:%23E0F6FF;stop-opacity:1" /></linearGradient></defs><rect width="1200" height="800" fill="url(%23sky)"/><g><path d="M0,600 Q200,550 400,580 T800,570 T1200,580 L1200,800 L0,800 Z" fill="%2334C759"/><path d="M0,650 Q150,620 300,640 T600,630 T900,640 T1200,630 L1200,800 L0,800 Z" fill="%2322C55E"/></g><g><rect x="100" y="400" width="80" height="120" fill="%23D2691E"/><path d="M90,400 L140,350 L190,400 Z" fill="%23A0522D"/><rect x="120" y="450" width="20" height="30" fill="%23654321"/><rect x="110" y="480" width="15" height="15" fill="%23FFD700"/><rect x="155" y="480" width="15" height="15" fill="%23FFD700"/></g><g><rect x="300" y="420" width="100" height="100" fill="%23D2691E"/><path d="M285,420 L350,370 L415,420 Z" fill="%23A0522D"/><rect x="330" y="460" width="25" height="35" fill="%23654321"/><rect x="320" y="490" width="18" height="18" fill="%23FFD" width="18" height="18" fill="%23FFD700"/></g><g><rect x="500" y="430" width="90" height="110" fill="%23D2691E"/><path d="M485,430 L545,380 L605,430 Z" fill="%23A0522D"/><rect x="525" y="470" width="22" height="32" fill="%23654321"/><rect x="515" y="500" width="16" height="16" fill="%23FFD700"/><rect x="559" y="500" width="16" height="16" fill="%23FFD700"/></g><g><rect x="700" y="410" width="85" height="130" fill="%23D2691E"/><path d="M690,410 L742,360 L795,410 Z" fill="%23A0522D"/><rect x="720" y="460" width="23" height="33" fill="%23654321"/><rect x="710" y="490" width="17" height="17" fill="%23FFD700"/><rect x="755" y="490" width="17" height="17" fill="%23FFD700"/></g><g><ellipse cx="200" cy="300" rx="40" ry="60" fill="%23228B22"/><ellipse cx="450" cy="280" rx="35" ry="55" fill="%23228B22"/><ellipse cx="650" cy="290" rx="45" ry="65" fill="%23228B22"/><ellipse cx="850" cy="275" rx="38" ry="58" fill="%23228B22"/></g><g><circle cx="150" cy="180" r="80" fill="%23FFD700" opacity="0.9"/><path d="M120,160 Q150,140 180,160 Q150,180 120,160" fill="%23FFA500"/></g><g><path d="M0,680 Q300,660 600,670 T1200,665 L1200,800 L0,800 Z" fill="%23D2691E" opacity="0.3"/></g></svg>')`
        }}
      />
      




      {/* Login Form */}
      <div className="bg-white/95 p-8 rounded-2xl shadow-2xl w-full max-w-sm backdrop-blur-md border border-blue-200 relative z-10">
        {/* Logo/Image */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full shadow-lg overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Orange building base */}
              <rect x="10" y="30" width="80" height="65" fill="#FF6B35" rx="5"/>
              
              {/* Dark header with text */}
              <rect x="15" y="15" width="70" height="25" fill="#4A4A4A" rx="5"/>
              <text x="50" y="32" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">BIJALPUR</text>
              
              {/* Building windows */}
              <rect x="20" y="45" width="12" height="20" fill="#FFE4E1" rx="2"/>
              <rect x="37" y="45" width="12" height="20" fill="#FFE4E1" rx="2"/>
              <rect x="54" y="45" width="12" height="20" fill="#FFE4E1" rx="2"/>
              <rect x="71" y="45" width="12" height="20" fill="#FFE4E1" rx="2"/>
              
              {/* Door */}
              <rect x="42" y="70" width="16" height="20" fill="#FFE4E1" rx="2"/>
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-blue-800 font-serif mb-6 drop-shadow-lg">
          BIJALPURSEWA LOGIN
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-blue-900 font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-300"
              placeholder="Enter your mobile number"
              required
            />
          </div>
          <div>
            <label className="block text-blue-900 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-300"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-sm text-gray-700 hover:text-blue-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-xl transition duration-300 shadow-md"
          >
            Login
          </button>
        </div>
        <p className="text-center text-sm text-blue-900 mt-4 font-serif">
          Don't have an account? <a href="#" className="text-blue-700 underline hover:text-blue-800">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;