import React from "react";

const AdminPanel = () => {
  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Real Estate Admin</h1>
        </div>
        <nav className="mt-6">
          <a
            href="/dashboard"
            className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            Dashboard
          </a>
          <a
            href="/ListingItem"
            className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            ListingItem
          </a>
          <a
            href="/offers"
            className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            Offers
          </a>
          <a
            href="/profile"
            className="block py-3 px-6 text-gray-700 hover:bg-gray-200 rounded-md"
          >
            My Profile
          </a>
          <a
            href="/CreateListing"
            className="block py-3 px-6 text-gray-700 hover:bg-red-100 rounded-md"
          >
            Create Listing
          </a>
          <a
            href="/logout"
            className="block py-3 px-6 text-red-500 hover:bg-red-100 rounded-md"
          >
            Log Out
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">Welcome, Admin</p>
            <img
              src="/profile.jpg"
              alt="Admin Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Properties
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">152</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Active Offers
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">34</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                New Clients
              </h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">18</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Pending Deals
              </h3>
              <p className="text-3xl font-bold text-red-600 mt-2">5</p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buyers Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Recent Buyers
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex justify-between text-gray-600">
                  <span>Buyer #1</span>
                  <span className="text-sm text-gray-500">Joined: Jan 15</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span>Buyer #2</span>
                  <span className="text-sm text-gray-500">Joined: Jan 14</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span>Buyer #3</span>
                  <span className="text-sm text-gray-500">Joined: Jan 13</span>
                </li>
              </ul>
            </div>

            {/* Sellers Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Recent Sellers
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex justify-between text-gray-600">
                  <span>Seller #1</span>
                  <span className="text-sm text-gray-500">Listed: Jan 14</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span>Seller #2</span>
                  <span className="text-sm text-gray-500">Listed: Jan 13</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span>Seller #3</span>
                  <span className="text-sm text-gray-500">Listed: Jan 12</span>
                </li>
              </ul>
            </div>

            {/* Offers Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Latest Offers
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex justify-between text-gray-600">
                  <span>Offer #1</span>
                  <span className="text-sm text-gray-500">$200,000</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span>Offer #2</span>
                  <span className="text-sm text-gray-500">$180,000</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span>Offer #3</span>
                  <span className="text-sm text-gray-500">$150,000</span>
                </li>
              </ul>
            </div>

            {/* Recent Activities Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Recent Activities
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex justify-between text-gray-600">
                  <span>Property #101 updated</span>
                  <span className="text-sm text-gray-500">10 mins ago</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span>New offer received</span>
                  <span className="text-sm text-gray-500">30 mins ago</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span>Client #456 signed up</span>
                  <span className="text-sm text-gray-500">1 hour ago</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
