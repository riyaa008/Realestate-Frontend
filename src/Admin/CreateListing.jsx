import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import person from "../assests/icons/profile.png";
import Sidebar from "./Components/Sidebar";

export default function CreateListing() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch all listings
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/listings");
      if (response.data && Array.isArray(response.data)) {
        setListings(response.data);
      } else {
        setListings([]);
        setError("No listings found or invalid data format");
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err.response?.data?.message || "Failed to fetch listings");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    } else if (e.target.type === "checkbox") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
  };

  // Handle image selection
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);

      for (const file of files) {
        if (file.size > 2 * 1024 * 1024) {
          setImageUploadError("Image size should be less than 2MB");
          setUploading(false);
          return;
        }
      }

      try {
        const promises = files.map((file) => storeImage(file));
        const urls = await Promise.all(promises);

        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...urls],
        }));
        setImageUploadError(false);
      } catch (err) {
        console.error("Image upload error:", err);
        setImageUploadError("Failed to upload images. Please try again.");
      }
      setUploading(false);
    } else {
      setImageUploadError("You can only upload up to 6 images per listing");
    }
  };

  // Store image as base64
  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file"));
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(new Error("Failed to read file"));
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        setError("You must upload at least one image");
        return;
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        setError("Discount price must be lower than regular price");
        return;
      }

      setLoading(true);
      setError(null);

      const data = {
        ...formData,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        regularPrice: parseFloat(formData.regularPrice),
        discountPrice: parseFloat(formData.discountPrice),
      };

      let response;
      if (editMode) {
        response = await axios.put(
          `http://localhost:5000/api/listings/${editId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/listings",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      setLoading(false);
      if (response.data.success) {
        // Refresh listings after creating/updating
        fetchListings();
        // Reset form and edit mode
        setFormData({
          name: "",
          description: "",
          address: "",
          type: "rent",
          bedrooms: 1,
          bathrooms: 1,
          regularPrice: 50,
          discountPrice: 0,
          offer: false,
          parking: false,
          furnished: false,
          imageUrls: [],
        });
        setEditMode(false);
        setEditId(null);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
  };

  // Handle image deletion
  const handleImageDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // Handle delete listing
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        setLoading(true);
        const response = await axios.delete(`http://localhost:5000/api/listings/${id}`);
        if (response.data.success) {
          setListings(listings.filter(listing => listing._id !== id));
          setError(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete listing");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit listing
  const handleEdit = (listing) => {
    setEditMode(true);
    setEditId(listing._id);
    setFormData({
      name: listing.name,
      description: listing.description,
      address: listing.address,
      type: listing.type,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      regularPrice: listing.regularPrice,
      discountPrice: listing.discountPrice,
      offer: listing.offer,
      parking: listing.parking,
      furnished: listing.furnished,
      imageUrls: listing.imageUrls,
    });
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
          <a href="/offers" className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md">
            Offers
          </a>
          <a href="/CreateListing" className="block py-3 px-6 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md">
            Create Listing
          </a>
          <a href="/logout" className="block py-3 px-6 text-red-500 hover:bg-red-100 rounded-md mt-4">
            Log Out
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {/* Main Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Edit Listing" : "Create Listing"}
          </h2>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Create Listing Form */}
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 border rounded-lg"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  minLength="10"
                  maxLength="62"
                  required
                />
                <textarea
                  placeholder="Description"
                  className="w-full px-4 py-2 border rounded-lg"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full px-4 py-2 border rounded-lg"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />

                {/* Property Type */}
                <div className="flex gap-6">
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      id="sale"
                      className="w-5"
                      onChange={handleChange}
                      checked={formData.type === "sale"}
                    />
                    <span>Sell</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="radio"
                      id="rent"
                      className="w-5"
                      onChange={handleChange}
                      checked={formData.type === "rent"}
                    />
                    <span>Rent</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex gap-6">
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="parking"
                      className="w-5"
                      checked={formData.parking}
                      onChange={handleChange}
                    />
                    <span>Parking</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="furnished"
                      className="w-5"
                      checked={formData.furnished}
                      onChange={handleChange}
                    />
                    <span>Furnished</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      id="offer"
                      className="w-5"
                      checked={formData.offer}
                      onChange={handleChange}
                    />
                    <span>Offer</span>
                  </div>
                </div>

                {/* Rooms and Price */}
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="bedrooms"
                      min="1"
                      max="10"
                      required
                      className="p-3 border rounded-lg w-20"
                      value={formData.bedrooms}
                      onChange={handleChange}
                    />
                    <p>Beds</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="bathrooms"
                      min="1"
                      max="10"
                      required
                      className="p-3 border rounded-lg w-20"
                      value={formData.bathrooms}
                      onChange={handleChange}
                    />
                    <p>Baths</p>
                  </div>
                </div>

                {/* Prices */}
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="regularPrice"
                      min="50"
                      max="10000000"
                      required
                      className="p-3 border rounded-lg w-32"
                      value={formData.regularPrice}
                      onChange={handleChange}
                    />
                    <div>
                      <p>Regular price</p>
                      {formData.type === "rent" && (
                        <span className="text-xs">($ / month)</span>
                      )}
                    </div>
                  </div>
                  {formData.offer && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        id="discountPrice"
                        min="0"
                        max="10000000"
                        required
                        className="p-3 border rounded-lg w-32"
                        value={formData.discountPrice}
                        onChange={handleChange}
                      />
                      <div>
                        <p>Discounted price</p>
                        {formData.type === "rent" && (
                          <span className="text-xs">($ / month)</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Images */}
              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">
                    Images:
                    <span className="font-normal text-gray-600 ml-2">
                      The first image will be the cover (max 6)
                    </span>
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="w-full p-3 border rounded-lg"
                    disabled={uploading}
                  />
                </div>

                {uploading && <p className="text-green-700">Uploading...</p>}
                {imageUploadError && (
                  <p className="text-red-700">{imageUploadError}</p>
                )}

                {formData.imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Listing ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageDelete(index)}
                          className="absolute top-2 right-2 bg-red-700 text-white p-1 rounded-full text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              {error && <p className="text-red-700 mb-4">{error}</p>}
              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Creating..." : editMode ? "Update Listing" : "Create Listing"}
              </button>
            </div>
          </form>

          {/* Existing Listings */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Existing Listings</h2>
            {loading && (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
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
                    <h3
                      className="text-lg font-semibold text-gray-800 mb-2 truncate"
                      title={listing.name}
                    >
                      {listing.name}
                    </h3>
                    <p
                      className="text-gray-600 mb-2 truncate"
                      title={listing.address}
                    >
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
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEdit(listing)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(listing._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
