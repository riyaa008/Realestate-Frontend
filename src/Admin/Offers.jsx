import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaBath,
  FaBed,
  FaCouch,
  FaMapMarkerAlt,
  FaParking,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import person from "../assests/icons/profile.png";

export default function Offers() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOfferListings();
  }, []);

  const fetchOfferListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/listings");

      if (response.data && Array.isArray(response.data)) {
        const offersOnly = response.data.filter(
          (listing) => listing.offer && listing.discountPrice > 0
        );
        setListings(offersOnly);
      } else {
        setListings([]);
        setError("No listings found or invalid data format");
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err.response?.data?.message || "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/sign-in");
  };

  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  const ListingDetailModal = ({ listing, onClose }) => {
    if (!listing) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
            >
              <FaTimes size={24} />
            </button>

            {/* Image Slider */}
            <div className="relative h-96">
              <img
                src={listing.imageUrls[0]}
                alt={listing.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{listing.name}</h2>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="mr-2" />
                <p>{listing.address}</p>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-green-600">
                    ${formatPrice(listing.discountPrice)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ${formatPrice(listing.regularPrice)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(
                      ((listing.regularPrice - listing.discountPrice) /
                        listing.regularPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </div>
                <p className="text-gray-600 mt-2">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <FaBed className="text-gray-600" />
                  <span>
                    {listing.bedrooms}{" "}
                    {listing.bedrooms > 1 ? "Bedrooms" : "Bedroom"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBath className="text-gray-600" />
                  <span>
                    {listing.bathrooms}{" "}
                    {listing.bathrooms > 1 ? "Bathrooms" : "Bathroom"}
                  </span>
                </div>
                {listing.parking && (
                  <div className="flex items-center gap-2">
                    <FaParking className="text-gray-600" />
                    <span>Parking</span>
                  </div>
                )}
                {listing.furnished && (
                  <div className="flex items-center gap-2">
                    <FaCouch className="text-gray-600" />
                    <span>Furnished</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{listing.description}</p>
              </div>

              {/* Contact Button */}
              <button
                onClick={() =>
                  (window.location.href = `mailto:contact@realestate.com?subject=Inquiry about ${listing.name}`)
                }
                className="w-full bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-800 transition"
              >
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
          <a href="/dashboard" className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md">
            Dashboard
          </a>
          <a href="/ListingItem" className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md">
            ListingItem
          </a>
          <a href="/offers" className="block py-3 px-6 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md">
            Offers
          </a>
          <a href="/CreateListing" className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md">
            Create Listing
          </a>
          <a href="/logout" className="block py-3 px-6 text-red-500 hover:bg-red-100 rounded-md mt-4">
            Log Out
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Special Offers
          </h2>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          {loading ? (
            <div className="text-center text-2xl mt-10">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 text-xl mt-10">
              {error}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {listings.length === 0 ? (
                <div className="text-center text-xl text-gray-500">
                  No offers available at the moment
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <div
                      key={listing._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <img
                        src={listing.imageUrls[0]}
                        alt={listing.name}
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {listing.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {listing.address}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-600 font-semibold">
                            ${formatPrice(listing.discountPrice)}
                          </span>
                          <span className="text-gray-500 line-through">
                            ${formatPrice(listing.regularPrice)}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                            {Math.round(
                              ((listing.regularPrice -
                                listing.discountPrice) /
                                listing.regularPrice) *
                                100
                            )}
                            % OFF
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600 mb-4">
                          <span>
                            {listing.bedrooms}{" "}
                            {listing.bedrooms > 1 ? "beds" : "bed"}
                          </span>
                          <span>
                            {listing.bathrooms}{" "}
                            {listing.bathrooms > 1 ? "baths" : "bath"}
                          </span>
                          <span>
                            {listing.type === "rent"
                              ? "For Rent"
                              : "For Sale"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {listing.parking && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                              Parking
                            </span>
                          )}
                          {listing.furnished && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
                              Furnished
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-4 border-t">
                        <button
                          onClick={() => handleViewDetails(listing)}
                          className="block w-full text-center bg-slate-700 text-white py-2 rounded-md hover:bg-slate-800 transition"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {showModal && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => {
            setShowModal(false);
            setSelectedListing(null);
          }}
        />
      )}
    </div>
  );
}
