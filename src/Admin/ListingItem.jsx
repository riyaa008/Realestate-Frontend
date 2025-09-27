import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import person from "../assests/icons/profile.png";

const ListingItem = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState({
    rentSale: false,
    rent: false,
    sale: false,
    offer: false,
  });
  const [amenities, setAmenities] = useState({
    parking: false,
    furnished: false,
  });
  const [sort, setSort] = useState("priceHighToLow");

  // Fetch listings
  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    // filterListings();
  }, [searchTerm, listings]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/listings');
      if (response.data && Array.isArray(response.data)) {
        setListings(response.data);
      } else {
        setListings([]);
        setError('No listings found or invalid data format');
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err.response?.data?.message || 'Failed to fetch listings');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete listing with proper error handling
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
    try {
        setError(null);
      await axios.delete(`http://localhost:5000/api/listings/${id}`);
        setListings(prev => prev.filter(listing => listing._id !== id));
    } catch (err) {
        console.error('Error deleting listing:', err);
        setError(err.response?.data?.message || 'Failed to delete listing');
      }
    }
  };

  // Filter listings based on search criteria
  const getFilteredListings = () => {
    if (!listings) return [];
    
    return listings.filter(listing => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.address.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filters
      const matchesType = 
        (!type.rent && !type.sale) || // If none selected, show all
        (type.rent && listing.type === 'rent') ||
        (type.sale && listing.type === 'sale');

      // Offer filter
      const matchesOffer = !type.offer || listing.offer;

      // Amenities filters
      const matchesAmenities =
        (!amenities.parking && !amenities.furnished) || // If none selected, show all
        ((!amenities.parking || listing.parking) &&
         (!amenities.furnished || listing.furnished));

      return matchesSearch && matchesType && matchesOffer && matchesAmenities;
    });
  };

  // Sort listings
  const getSortedListings = (filteredListings) => {
    return [...filteredListings].sort((a, b) => {
      switch (sort) {
        case 'priceHighToLow':
          return b.regularPrice - a.regularPrice;
        case 'priceLowToHigh':
          return a.regularPrice - b.regularPrice;
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });
  };

  const handleTypeChange = (e) => {
    const { name, checked } = e.target;
    setType({ ...type, [name]: checked });
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setAmenities({ ...amenities, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleEdit = (id) => {
    navigate(`/edit-listing/${id}`);
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
          <a href="/ListingItem" className="block py-3 px-6 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md">
            ListingItem
          </a>
          <a href="/offers" className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Listing Items
          </h2>
        </div>

        {/* Search Form */}
        <div className="p-6">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Listings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
                  Search Term:
                </label>
                <input
                  type="text"
                  id="searchTerm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search..."
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type:
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rentSale"
                      checked={type.rentSale}
                      onChange={handleTypeChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Rent & Sale
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rent"
                      checked={type.rent}
                      onChange={handleTypeChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Rent</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="sale"
                      checked={type.sale}
                      onChange={handleTypeChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Sale</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="offer"
                      checked={type.offer}
                      onChange={handleTypeChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Offer</span>
                  </label>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities:
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="parking"
                      checked={amenities.parking}
                      onChange={handleAmenityChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Parking</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="furnished"
                      checked={amenities.furnished}
                      onChange={handleAmenityChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Furnished
                    </span>
                  </label>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label
                  htmlFor="sort"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sort:
                </label>
                <select
                  id="sort"
                  name="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="priceHighToLow">Price high to low</option>
                  <option value="priceLowToHigh">Price low to high</option>
                  <option value="latest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                SEARCH
              </button>
            </form>
          </div>

          {/* Listings Display */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Listings Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : !listings || listings.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No listings found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getSortedListings(getFilteredListings()).map((listing) => (
                  <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      <img
                        src={listing.imageUrls[0]}
                        alt={listing.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 space-x-2">
                        {listing.type === 'rent' && (
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
                            For Rent
                          </span>
                        )}
                        {listing.type === 'sale' && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                            For Sale
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate" title={listing.name}>
                        {listing.name}
                      </h3>
                      <p className="text-gray-600 mb-2 truncate" title={listing.address}>
                        {listing.address}
                      </p>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-gray-700 font-bold">
                          ${listing.regularPrice.toLocaleString()}
                          {listing.type === 'rent' && '/month'}
                        </div>
                        {listing.offer && (
                          <div className="text-green-600 font-semibold">
                            ${listing.discountPrice.toLocaleString()} off!
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex space-x-4 text-gray-500">
                          <span title="Bedrooms">
                            <i className="fas fa-bed mr-1"></i> {listing.bedrooms}
                          </span>
                          <span title="Bathrooms">
                            <i className="fas fa-bath mr-1"></i> {listing.bathrooms}
                          </span>
                          <span>{listing.type === "rent" ? "For Rent" : "For Sale"}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="space-x-2">
                          {listing.parking && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              Parking
                            </span>
                          )}
                          {listing.furnished && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              Furnished
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingItem;
