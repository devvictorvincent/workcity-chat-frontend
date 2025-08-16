import { BrowserRouter, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";  
import AdminDashboard from "./pages/admin/index.jsx";
import Login from "./pages/auth/login.jsx";
import Signup from "./pages/auth/signup.jsx";
import Inbox from "./pages/dashboard/Inbox.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import PrivateRoute from "./components/layouts/PrivateRoute.jsx";
import { AuthProvider } from "./context/AuthContext.js";
 
// Change this to your backend URL
const socket = io("http://localhost:5000");

function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/signup" element={<Signup />} /> 
          <Route path="/admin" element={<AdminDashboard />} /> 
          <Route
            path="/inbox"
            element={
              <PrivateRoute>
                <Inbox />
              </PrivateRoute>
            }
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          /> 
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
