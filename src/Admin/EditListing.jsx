import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import person from "../assests/icons/profile.png";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch listing data when component mounts
  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/listings/${id}`);
      
      if (response.data) {
        // Format the data to match the form structure
        const listingData = {
          ...response.data,
          regularPrice: Number(response.data.regularPrice),
          discountPrice: Number(response.data.discountPrice),
          bedrooms: Number(response.data.bedrooms),
          bathrooms: Number(response.data.bathrooms),
          type: response.data.type || 'rent',
          offer: Boolean(response.data.offer),
          parking: Boolean(response.data.parking),
          furnished: Boolean(response.data.furnished),
        };
        setFormData(listingData);
        setError('');
      } else {
        setError('No listing data found');
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      setError(error.response?.data?.message || 'Failed to fetch listing details');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageSubmit = async (e) => {
    try {
      const files = Array.from(e.target.files);
      
      if (!files.length) {
        setImageUploadError('Please select at least one image');
        return;
      }

      if (files.length + formData.imageUrls.length > 6) {
        setImageUploadError('You can only upload up to 6 images total');
        return;
      }

      setImageUploadError(null);
      setUploading(true);

      const promises = files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      });

      const urls = await Promise.all(promises);
      
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls]
      }));
      setImageUploadError(null);
    } catch (error) {
      console.error('Error uploading images:', error);
      setImageUploadError('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : 
              value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (formData.imageUrls.length < 1) {
        setError('You must upload at least one image');
        return;
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        setError('Discount price must be lower than regular price');
        return;
      }

      if (formData.name.length < 3) {
        setError('Name must be at least 3 characters long');
        return;
      }

      setLoading(true);
      setError(null);
      setUpdateSuccess(false);

      // Format data for submission
      const submitData = {
        ...formData,
        regularPrice: Number(formData.regularPrice),
        discountPrice: Number(formData.discountPrice),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        offer: Boolean(formData.offer),
        parking: Boolean(formData.parking),
        furnished: Boolean(formData.furnished),
      };

      const response = await axios.put(`http://localhost:5000/api/listings/${id}`, submitData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        setUpdateSuccess(true);
        // Show success message for 1.5 seconds before navigating
        setTimeout(() => {
          navigate('/ListingItem');
        }, 1500);
      } else {
        setError('Failed to update listing');
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      setError(error.response?.data?.message || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  // Handle image deletion with confirmation
  const handleImageDelete = (index) => {
    if (formData.imageUrls.length <= 1) {
      setImageUploadError('You must have at least one image');
      return;
    }

    if (window.confirm('Are you sure you want to delete this image?')) {
      setFormData(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter((_, i) => i !== index)
      }));
      setImageUploadError(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Listing</h1>
        
        {/* Loading State */}
        {loading && !formData.name && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            Listing updated successfully!
          </div>
        )}

        {formData.name && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Property Name"
                  required
                  minLength="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows="4"
                  placeholder="Property Description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Property Address"
                  required
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>
              </div>

              {formData.offer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discounted Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                      min="1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>
            </div>

            {/* Property Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="offer"
                  checked={formData.offer}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Has Offer</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Parking</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Furnished</label>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">Property Images</h3>
                <span className="text-sm text-gray-500">
                  {formData.imageUrls.length}/6 images
                </span>
              </div>

              {imageUploadError && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {imageUploadError}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSubmit}
                  className="hidden"
                  id="images"
                  multiple
                />
                <label
                  htmlFor="images"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-colors duration-200"
                >
                  Upload Images
                </label>
                <span className="text-sm text-gray-500">
                  First image will be the cover (max 6)
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/ListingItem')}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Updating...' : 'Update Listing'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
