import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ?
   <>
   <Header user={user} />
    <div className="container mx-auto px-4 py-6">
      {children}
    </div>
  </>
 : <Navigate to="/" replace />;
};

export default PrivateRoute;
