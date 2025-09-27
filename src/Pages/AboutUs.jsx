import React from "react";
import { Link } from "react-router-dom";
import home from "../assests/other/first.png";
import home2 from "../assests/other/first2.png";
import home3 from "../assests/other/first3.png";

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* About Header Section */}
        <div className="py-20 px-4 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-slate-800">
            About Us Real Estate
          </h1>
          <p className="mb-4 text-slate-700">
            Real Estate is a leading real estate agency that specializes in
            helping clients buy, sell, and rent properties in the most desirable
            neighborhoods. Our team of experienced agents is dedicated to
            providing exceptional service and making the buying and selling
            process as smooth as possible.
          </p>
          <p className="mb-4 text-slate-700">
            Our mission is to help our clients achieve their real estate goals
            by providing expert advice, personalized service, and a deep
            understanding of the local market. Whether you are looking to buy,
            sell, or rent a property, we are here to help you every step of the
            way.
          </p>
          <p className="mb-4 text-slate-700">
            Our team of agents has a wealth of experience and knowledge in the
            real estate industry, and we are committed to providing the highest
            level of service to our clients. We believe that buying or selling a
            property should be an exciting and rewarding experience, and we are
            dedicated to making that a reality for each and every one of our
            clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="relative group cursor-pointer">
            <img
              src={home}
              alt="Luxury Living"
              className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 rounded-lg group-hover:bg-opacity-20 transition-all duration-300"></div>
          </div>
          <div className="relative group cursor-pointer">
            <img
              src={home2}
              alt="Modern Spaces"
              className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 rounded-lg group-hover:bg-opacity-20 transition-all duration-300"></div>
          </div>
          <div className="relative group cursor-pointer">
            <img
              src={home3}
              alt="Affordable Homes"
              className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 rounded-lg group-hover:bg-opacity-20 transition-all duration-300"></div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/contact"
            className="inline-block px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg 
            hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 
            shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Contact Us for More Information
          </Link>
          <p className="mt-4 text-gray-600">
            Have questions? Our team is here to help!
          </p>
        </div>
      </div>
    </div>
  );
}
