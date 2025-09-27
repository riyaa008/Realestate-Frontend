import { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we have email and message from registration
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
      if (location.state.message) {
        setSuccess(location.state.message);
      }
    }
  }, [location]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signin", formData);
      
      if (response.data.success) {
        // Store the token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate("/"); // Redirect to home page
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      if (error.response?.status === 404) {
        setError("No account found with this email. Please sign up first.");
        setTimeout(() => {
          navigate("/sign-up", { state: { email: formData.email } });
        }, 2000);
      } else if (error.response?.status === 401) {
        setError("Incorrect password. Please try again.");
      } else {
        setError(error.response?.data?.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("Google Sign In is currently not available. Please use email and password.");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={true}
            className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:bg-blue-800 disabled:opacity-80 flex items-center justify-center gap-2"
          >
            <FaGoogle className="text-white" size={20} />
            Sign In With Google
          </button>
        </form>
        <div className="flex gap-2 mt-5">
          <p>Don't have an account?</p>
          <Link to={"/sign-up"}>
            <span className="text-blue-700">Sign up</span>
          </Link>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-5">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
