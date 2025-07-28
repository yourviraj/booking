import React, { useEffect } from "react";
// import Navbar from './Component/Navbar';
import DharamshalaBooking from "./Pages/DharamshalaList";
import AdminBookingPanel from "./Pages/admin/AdminBookingPanel";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./Pages/admin/Dashboard";
import Dharamshala from "./Pages/admin/Dharamshala";
import Admins from "./Pages/admin/Admins";
import { useDispatch, useSelector } from "react-redux";
import { asyncloaduser, asynclogout } from "./store/userAction";
import Loader from "./Components/Loader";

const App = () => {
  const dispatch = useDispatch();
  const { page_loading } = useSelector((user) => user.user);

  useEffect(() => {
    const id = window.localStorage.getItem("id");
    if (id) {
      dispatch(asyncloaduser(id));
    } else {
      dispatch(asynclogout());
    }
  }, []);

  if (page_loading) {
    return <Loader />;
  }
  return (
    <Routes>
      <Route path="/" element={<DharamshalaBooking />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="admins" element={<Admins />} />
        <Route path="dharamshala" element={<Dharamshala />} />
        <Route path="dharamshala/booking/:id" element={<AdminBookingPanel />} />
      </Route>
    </Routes>
  );
};

export default App;
