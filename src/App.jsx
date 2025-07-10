import React from "react";
// import Navbar from './Component/Navbar';
import DharamshalaBooking from "./Component/DharamshalaList";
import AdminBookingPanel from "./Component/AdminBookingPanel";
import LoginPage from "./Component/loginpage";
import RegisterPage from "./Component/Registration";
import UploadDharmshala from "./Component/UploadDharmshala";
import AdminDashboard from "./components/admin/AdminDashboard";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/admin/Dashboard";
import Dharamshala from "./components/admin/Dharamshala";
import Admins from "./components/admin/Admins";

const App = () => {
  return (
    <Routes>
       <Route path="admins" element={<AdminBookingPanel /> } />
      <Route path="/" element={<DharamshalaBooking />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/upload" element={<UploadDharmshala />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="dharamshala" element={<Dharamshala />} />
        <Route path="admins" element={<Admins />} />
       
      </Route>
    </Routes>
  );
};

export default App;
