import { useState } from "react";
import { useNavigate } from "react-router-dom";

import home from "../assests/other/first.png";
import home2 from "../assests/other/first2.png";
import home3 from "../assests/other/first3.png";

// Search Page
export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const offersData = [
    {
      id: 1,
      title: "Ultra-Modern Penthouse in the Cloud",
      address: "456 Serenity Lane, Meadowville",
      price: "$780 / month",
      imageUrl: home,
      beds: "6 beds",
      baths: "5 baths",
    },
    {
      id: 2,
      title: "Mara Kangana",
      address: "Jamaica",
      price: "$1,100",
      description: "I want to buy",
      imageUrl: home2,
      beds: "10 beds",
      baths: "5 baths",
    },
    {
      id: 3,
      title: "Luxury Penthouse with Panoramic Views",
      address: "456 Skyline Avenue, Metroville, FAKE456",
      price: "$594 / month",
      description:
        "Live the high life in this stunning 3-bedroom, 3.5-bathroom penthouse. With floor-to-ceiling windows.",
      imageUrl: home3,
      beds: "1 bed",
      baths: "1 bath",
    },
    {
      id: 4,
      title: "Luxury Penthouse with Panoramic Views",
      address: "456 Skyline Avenue, Metroville, FAKE456",
      price: "$594 / month",
      description:
        "Live the high life in this stunning 3-bedroom, 3.5-bathroom penthouse. With floor-to-ceiling windows.",
      imageUrl: home2,
      beds: "1 bed",
      baths: "1 bath",
    },
    {
      id: 5,
      title: "Luxury Penthouse with Panoramic Views",
      address: "456 Skyline Avenue, Metroville, FAKE456",
      price: "$594 / month",
      description:
        "Live the high life in this stunning 3-bedroom, 3.5-bathroom penthouse. With floor-to-ceiling windows.",
      imageUrl: home3,
      beds: "1 bed",
      baths: "1 bath",
    },
    {
      id: 6,
      title: "Luxury Penthouse with Panoramic Views",
      address: "456 Skyline Avenue, Metroville, FAKE456",
      price: "$594 / month",
      description:
        "Live the high life in this stunning 3-bedroom, 3.5-bathroom penthouse. With floor-to-ceiling windows.",
      imageUrl: home,
      beds: "1 bed",
      baths: "1 bath",
    },
  ];

  // Handler for updating form data
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setSidebardata((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTypeChange = (type) => {
    setSidebardata((prev) => ({
      ...prev,
      type: type,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for search can be added here
    console.log(sidebardata);
    // Redirect to results page or perform the search
    navigate("/results");
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="radio"
                id="all"
                name="type"
                className="w-5"
                checked={sidebardata.type === "all"}
                onChange={() => handleTypeChange("all")}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                name="type"
                className="w-5"
                checked={sidebardata.type === "rent"}
                onChange={() => handleTypeChange("rent")}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                name="type"
                className="w-5"
                checked={sidebardata.type === "sale"}
                onChange={() => handleTypeChange("sale")}
              />
              <span>Sale</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={sidebardata.parking}
                onChange={handleInputChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sidebardata.furnished}
                onChange={handleInputChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort"
              className="border rounded-lg p-3"
              value={sidebardata.sort}
              onChange={handleInputChange}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-blue-500 cursor-pointer mb-4">
              Show more offers
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {offersData.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={offer.imageUrl}
                    alt={offer.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-500">{offer.address}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-bold text-gray-900">
                        {offer.price}
                      </span>
                      <div className="text-sm text-gray-500">
                        {offer.beds} • {offer.baths}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Render search results here */}
      </div>
    </div>
  );
}
