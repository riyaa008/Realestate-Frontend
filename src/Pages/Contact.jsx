import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Contact = () => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { listingId } = useParams();

  // Mock data for demonstration
  const mockLandlord = {
    username: "John Doe",
    email: "johndoe@example.com",
  };

  const mockListing = {
    name: "Sample Property",
    userRef: "123",
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setLoading(true);
        // In a real application, you would fetch the landlord data here
        // For now, we'll use mock data
        setLandlord(mockLandlord);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch landlord details");
        setLoading(false);
      }
    };

    fetchLandlord();
  }, [listingId]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-8">Contact Us</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {landlord && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="mb-4">
                Contact{" "}
                <span className="font-semibold">{landlord.username}</span> about{" "}
                <span className="font-semibold">
                  {mockListing.name.toLowerCase()}
                </span>
              </p>

              <textarea
                name="message"
                id="message"
                rows="4"
                value={message}
                onChange={onChange}
                placeholder="Enter your message here..."
                className="w-full border p-3 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              ></textarea>

              <Link
                to={`mailto:${landlord.email}?subject=Regarding ${mockListing.name}&body=${message}`}
                className="block w-full bg-blue-600 text-white text-center p-3 uppercase rounded-lg hover:bg-blue-700 transition-colors mt-4"
              >
                Send Message
              </Link>
            </div>
          )}

          {/* Additional Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">
              Additional Ways to Reach Us
            </h2>

            <div className="space-y-3">
              <p className="flex items-center">
                <span className="font-semibold w-24">Phone:</span>
                <a
                  href="tel:+1234567890"
                  className="text-blue-600 hover:text-blue-800"
                >
                  (123) 456-7890
                </a>
              </p>

              <p className="flex items-center">
                <span className="font-semibold w-24">Email:</span>
                <a
                  href="mailto:info@realestate.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  info@realestate.com
                </a>
              </p>

              <p className="flex items-center">
                <span className="font-semibold w-24">Address:</span>
                <span>123 Real Estate Street, City, State 12345</span>
              </p>
            </div>
          </div>

          {/* Office Hours */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Office Hours</h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default Contact;
