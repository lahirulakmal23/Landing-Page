import React from 'react';
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="bg-gradient-to-b from-[#0A0A3C] to-[#0F054C] text-white px-6 md:px-20 py-6 bg-cover h-[500px]">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="text-3xl font-bold">CrowdFlow</div>
        <nav className="hidden md:flex space-x-8 text-lg font-medium gap-3">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/Eventcart" className="hover:text-gray-300">Event</Link>
          <Link to="/Service" className="hover:text-gray-300">Service</Link>
          <Link to="/About" className="hover:text-gray-300">About Us</Link>
        </nav>
        <button className="bg-gray-200 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-white">
          Get Started
        </button>
      </div>

      {/* Hero Text */}
      <div className="text-center mt-20 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Revolutionizing CrowdFlow with <br className="hidden md:block" /> Smart Technology
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="flex items-center bg-white text-black px-4 py-2 rounded-md w-full md:w-auto">
          <span className="mr-2">👤</span>
          <input
            type="text"
            placeholder="Type an Event name"
            className="outline-none bg-transparent w-full"
          />
          <span className="ml-2 cursor-pointer">❌</span>
        </div>

        <div className="flex items-center bg-white text-black px-4 py-2 rounded-md w-full md:w-auto">
          <span className="mr-2">📅</span>
          <input
            type="date"
            className="outline-none bg-transparent text-sm"
          />
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 w-full md:w-auto">
          Search
        </button>
      </div>
    </div>
  
  );
}

export default Header;
