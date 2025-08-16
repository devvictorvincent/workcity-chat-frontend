import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { io } from "socket.io-client";  
import AdminDashboard from "./pages/admin/index.jsx";
import Login from "./pages/auth/login.jsx";
import Signup from "./pages/auth/signup.jsx";

// Change this to your backend URL
const socket = io("http://localhost:5000");

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/admin" element={<AdminDashboard />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
