import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import home from "../assests/other/first.png";
import home2 from "../assests/other/first2.png";
import home3 from "../assests/other/first3.png";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentStep, setCurrentStep] = useState(0);
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);
  const [rentalInProgress, setRentalInProgress] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [showForm, setShowForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const images = [home, home2, home3];

  // Fetch listings
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

  const filteredListings = listings.filter(listing => {
    if (activeFilter === 'all') return true;
    return listing.type === activeFilter;
  });

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const sliderData = [
    {
      id: 1,
      title: "Date & Location",
      description: "Choose your preferred date and location for viewing properties",
      imgSrc: "https://ras.ooo/wp-content/uploads/2021/02/Date-Location.png",
    },
    {
      id: 2,
      title: "Select Your Home",
      description: "Browse through our curated selection of properties",
      imgSrc: "https://ras.ooo/wp-content/uploads/2021/02/Search-For-Car.png",
    },
    {
      id: 3,
      title: "Customer Details",
      description: "Provide your information to schedule a viewing",
      imgSrc: "https://ras.ooo/wp-content/uploads/2021/02/Upload-Documents.png",
    },
    {
      id: 4,
      title: "Booking Summary",
      description: "Review and confirm your property viewing details",
      imgSrc: "https://ras.ooo/wp-content/uploads/2021/02/Booking-Summary.png",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % sliderData.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handleBuyNow = (listingId) => {
    const listing = listings.find(listing => listing._id === listingId);
    console.log("Buy Now clicked for listing ID:", listingId); // Debugging log
    setSelectedListing(listing);
    setShowForm(true);
  };

  const handleForRent = async (listingId) => {
    try {
      setRentalInProgress(true);
      const response = await axios.post(`http://localhost:5000/api/rent/${listingId}`);
      alert('Rental application successful: ' + response.data.message);
      // Redirect or update state as needed
    } catch (error) {
      console.error('Rental error:', error);
      alert('Failed to initiate rental: ' + error.message);
    } finally {
      setRentalInProgress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/submit', { ...formData, listingId: selectedListing._id });
      setFormData({ name: '', phone: '' });
      setShowForm(false);
      alert('Submission successful!');
    } catch (err) {
      console.error('Failed to submit data:', err);
      setError('Failed to submit data');
    }
  };

  return (
    <div>
      {/* top */}
      <div className="bg-gray-100 min-h-screen">
        <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
            Find your next <span className="text-[#8BAAD6]">Perfect</span>
            <br />
            place with ease
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            Real Estate is the best place to find your next perfect place to
            live.
            <br />
            We have a wide range of properties for you to choose from.
          </div>
          <Link
            to={"/search"}
            className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
          >
            Let's get started...
          </Link>
        </div>

        {/* Image Slider */}
        <div className="mt-6 relative">
          <img
            src={images[currentImageIndex]}
            alt="Find Your Perfect Home"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={prevImage}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-2xl bg-gray-800 p-2 rounded-full"
          >
            &#10094;
          </button>
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-2xl bg-gray-800 p-2 rounded-full"
          >
            &#10095;
          </button>
        </div>

        {/* Listings Section */}
        <section className="listings-section py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Properties</h2>
            
            {/* Filter Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-[#8BAAD6] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Properties
              </button>
              <button
                onClick={() => setActiveFilter('sale')}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  activeFilter === 'sale'
                    ? 'bg-[#8BAAD6] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                For Sale
              </button>
              <button
                onClick={() => setActiveFilter('rent')}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  activeFilter === 'rent'
                    ? 'bg-[#8BAAD6] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                For Rent
              </button>
            </div>

            {loading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={listing.imageUrls[0] || 'https://via.placeholder.com/300x200'}
                        alt={listing.name}
                        className="w-full h-[200px] object-cover"
                      />
                      {listing.offer && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                          Offer!
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{listing.name}</h3>
                      <p className="text-gray-600 mb-2">{listing.address}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-[#8BAAD6]">
                          ${listing.regularPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {listing.type === 'rent' ? '/month' : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                          <span className="text-sm">
                            {listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}
                          </span>
                          <span className="text-sm">
                            {listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleBuyNow(listing._id)}
                          className="bg-[#8BAAD6] text-white px-6 py-2 rounded-full hover:bg-[#7B9AC6] transition-colors font-semibold"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How We Work Section */}
        <section className="howwework-section bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                How We Work
              </h2>
              <p className="text-gray-600">
                Find your dream home in just a few simple steps
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              {/* Slideshow Container */}
              <div className="relative bg-white rounded-lg shadow-lg p-8 min-h-[300px]">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#8BAAD6] text-white rounded-full flex items-center justify-center font-bold">
                  {sliderData[currentStep].id}
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2">
                    <div className="relative w-48 h-48 mx-auto">
                      <img
                        src={sliderData[currentStep].imgSrc}
                        alt={sliderData[currentStep].title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                      {sliderData[currentStep].title}
                    </h3>
                    <p className="text-gray-600">
                      {sliderData[currentStep].description}
                    </p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentStep((prevStep) => (prevStep - 1 + sliderData.length) % sliderData.length)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-[#8BAAD6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentStep((prevStep) => (prevStep + 1) % sliderData.length)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-[#8BAAD6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center mt-8 gap-4">
                {sliderData.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentStep === index
                        ? 'bg-[#8BAAD6] w-6'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to step ${step.id}`}
                  />
                ))}
              </div>

              {/* Progress Line */}
              <div className="hidden md:flex justify-between items-center mt-8 px-8">
                {sliderData.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex flex-col items-center ${
                      index === currentStep ? 'text-[#8BAAD6]' : 'text-gray-400'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        index === currentStep
                          ? 'border-[#8BAAD6] bg-[#8BAAD6] text-white'
                          : index < currentStep
                          ? 'border-[#8BAAD6] bg-[#8BAAD6] text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}>
                        {step.id}
                      </div>
                      <span className="text-sm mt-2">{step.title}</span>
                    </div>
                    {index < sliderData.length - 1 && (
                      <div className={`w-24 h-0.5 mx-2 ${
                        index < currentStep ? 'bg-[#8BAAD6]' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">About Us</h3>
                <p className="text-gray-400">
                  Real Estate is your trusted partner in finding the perfect
                  property. We offer a wide range of services to meet all your real
                  estate needs.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Properties
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>123 Real Estate Street</li>
                  <li>City, State 12345</li>
                  <li>Phone: (123) 456-7890</li>
                  <li>Email: info@realestate.com</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-blue-500">
                    <FaFacebook size={24} />
                  </a>
                  <a href="#" className="hover:text-blue-500">
                    <FaTwitter size={24} />
                  </a>
                  <a href="#" className="hover:text-blue-500">
                    <FaInstagram size={24} />
                  </a>
                  <a href="#" className="hover:text-blue-500">
                    <FaLinkedin size={24} />
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center border-t border-gray-700 pt-8">
              <div className="flex justify-center space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Cookie Policy
                </a>
              </div>
              <p className="text-sm text-gray-400">
                &copy; 2025 Real Estate Company. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {showForm && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <button type="submit">Submit</button>
          </form>
          {error && <p>{error}</p>}
          <button onClick={() => setShowForm(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
