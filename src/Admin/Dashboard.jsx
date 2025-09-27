import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import person from "../assests/icons/profile.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({
    totalProperties: 0,
    totalOffers: 0,
    forRent: 0,
    forSale: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const adminAuth = JSON.parse(localStorage.getItem("adminAuth"));
    if (!adminAuth || !adminAuth.isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchStatistics();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/login");
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/listings");
      if (response.data && Array.isArray(response.data)) {
        const listings = response.data;
        setStatistics({
          totalProperties: listings.length,
          totalOffers: listings.filter((listing) => listing.offer).length,
          forRent: listings.filter((listing) => listing.type === "rent").length,
          forSale: listings.filter((listing) => listing.type === "sale").length,
        });
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <div className="flex flex-col items-center">
            <img 
              src={localStorage.getItem('adminImage') || person}
              alt="Admin Profile"
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {localStorage.getItem('adminName') || 'Admin User'}
            </h2>
            <p className="text-sm text-gray-600">
              {localStorage.getItem('adminEmail') || 'admin@gmail.com'}
            </p>
          </div>
        </div>
        <nav className="mt-6">
          <a href="/dashboard" className="block py-3 px-6 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md">
            Dashboard
          </a>
          <a href="/ListingItem" className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md">
            ListingItem
          </a>
          <a href="/offers" className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md">
            Offers
          </a>
          <a href="/CreateListing" className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md">
            Create Listing
          </a>
          <a href="/Login" className="block py-3 px-6 text-red-500 hover:bg-red-100 rounded-md mt-4">
            Log Out
          </a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h2>
        </div>

        {loading ? (
          <div className="text-center">Loading statistics...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Properties Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Properties
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {statistics.totalProperties}
              </p>
            </div>

            {/* Total Offers Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Offers
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {statistics.totalOffers}
              </p>
            </div>

            {/* For Rent Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                For Rent
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                {statistics.forRent}
              </p>
            </div>

            {/* For Sale Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                For Sale
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                {statistics.forSale}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
