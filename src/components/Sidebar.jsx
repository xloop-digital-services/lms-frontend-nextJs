"use client"
import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`mt-40 fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:bg-transparent md:w-64`}>
        <div className="flex flex-col h-full p-4 bg-white md:bg-gray-100 md:shadow-lg">
          <button onClick={toggleSidebar} className="text-gray-700 mb-4 md:hidden">
            Close
          </button>
          <nav className="flex flex-col space-y-4">
            <a href="#dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
            <a href="#projects" className="text-gray-700 hover:text-gray-900">Projects</a>
            <a href="#tasks" className="text-gray-700 hover:text-gray-900">Tasks</a>
            <a href="#settings" className="text-gray-700 hover:text-gray-900">Settings</a>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 bg-gray-100 shadow-md md:hidden">
          <button onClick={toggleSidebar} className="text-gray-700">
            Menu
          </button>
        </header>
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold">Content Goes Here</h1>
          <p className="mt-4">This is your main content area. You can add more components and routes here.</p>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;