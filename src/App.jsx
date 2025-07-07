import React from 'react';
// import Navbar from './Component/Navbar'; 
import DharamshalaBooking from './Component/DharamshalaList';
import LoginPage from './Component/loginpage';
import RegisterPage from './Component/Registration';
import UploadDharmshala from './Component/UploadDharmshala';
const App = () => {
  return (
    <div>
      {/* <LoginPage /> */}
      {/* <RegisterPage /> */}
      <UploadDharmshala />
    <DharamshalaBooking />
    
    </div>
  );
}

export default App;
