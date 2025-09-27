import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Clear all admin-related data from localStorage
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminImage");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      setIsLoggingOut(false);
      navigate("/login", { 
        state: { 
          message: "Successfully logged out",
          type: "success" 
        } 
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl text-gray-700">Logging out...</h2>
        <p className="text-gray-500 mt-2">Please wait</p>
      </div>
    </div>
  );
};

export default Logout;
