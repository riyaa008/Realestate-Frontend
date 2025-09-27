import { FaSearch, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/sign-in');
  };

  return (
    <header className="bg-[#8BAAD6] shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-[#4d6a93]">Real</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <div className="relative w-full sm:w-64 bg-white rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
          <FaSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
        </div>
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 font-semibold hover:underline">
              Home
            </li>
          </Link>
          <Link to="/aboutus">
            <li className="hidden sm:inline text-slate-700 font-semibold hover:underline">
              About Us
            </li>
          </Link>
          {user ? (
            <div className="relative">
              <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
                  {user.username ? user.username[0].toUpperCase() : <FaUser />}
                </div>
                <span className="hidden sm:inline text-slate-700 font-semibold">
                  {user.username}
                </span>
              </div>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-semibold">{user.username}</div>
                    <div className="text-gray-500 text-xs truncate">{user.email}</div>
                  </div>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/sign-in">
              <li className="text-slate-700 font-semibold hover:underline">
                Sign in
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
