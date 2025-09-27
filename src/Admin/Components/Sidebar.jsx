import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import person from "../../assests/icons/profile.png";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
    if (!adminAuth || !adminAuth.isAuthenticated) {
      navigate("/login");
    } else {
      setAdmin(adminAuth);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-gray-200" : "";
  };

  if (!admin) return null;

  return (
    <aside className="w-64 bg-white shadow-md h-screen">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center space-x-4">
          <img
            src={admin.profileImg}
            alt="Admin Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-800">{admin.name}</h1>
            <p className="text-sm text-gray-600">{admin.email}</p>
          </div>
        </div>
      </div>
      <nav className="mt-6">
        <Link
          to="/dashboard"
          className={`block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md ${isActive(
            "/dashboard"
          )}`}
        >
          Dashboard
        </Link>
        <Link
          to="/ListingItem"
          className={`block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md ${isActive(
            "/listing-items"
          )}`}
        >
          Listing Items
        </Link>
        <Link
          to="/Offers"
          className={`block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md ${isActive(
            "/offers"
          )}`}
        >
          Offers
        </Link>
        <Link
          to="/CreateListing"
          className={`block py-3 px-6 text-gray-700 hover:bg-red-100 rounded-md ${isActive(
            "/create-listing"
          )}`}
        >
          Create Listing
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left py-3 px-6 text-red-500 hover:bg-red-100 rounded-md"
        >
          Log Out
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
