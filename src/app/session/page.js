"use client";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import SessionsTable from "@/components/SessionsTable";
import SessionCreationModal from "@/components/SessionCreationModal";
import { useSidebar } from "@/providers/useSidebar";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const [selectedCity, setSelectedCity] = useState("Select your city");
  const [selectedLocation, setSelectedLocation] = useState( "Select your location" );
  const [selectedBatch, setSelectedBatch] = useState("Select your batch");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  const toggleCityOpen = () => {
    setIsCityOpen(!isCityOpen);
  };

  const toggleLocationOpen = () => {
    setIsLocationOpen(!isLocationOpen);
  };

  const toggleBatchOpen = () => {
    setIsBatchOpen(!isBatchOpen);
  };

  const handleCitySelect = (option) => {
    setSelectedCity(option);
    setIsCityOpen(false);
  };
  const handleLocationSelect = (option) => {
    setSelectedLocation(option);
    setIsLocationOpen(false);
  };
  const handleBatchSelect = (option) => {
    setSelectedBatch(option);
    setIsBatchOpen(false);
  };

  const city0ptions = ["Karachi", "Lahore"];
  const location0ptions = ["Malir", "F B Area"];
  const batch0ptions = ["Batch 1", "Batch 2"];
  return (
    <div className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        width: isSidebarOpen ? "84%" : "100%",
      }}>
        <div className="bg-surface-100 p-6 rounded-xl">
      <div className="w-full flex justify-between items-center  gap-4">
        <div>
          <p className="font-bold text-xl">Sessions Details</p>
        </div>
        <div className="flex gap-3">
          <div>
            <button
              onClick={toggleCityOpen}
              className="flex justify-between items-center md:w-[200px] w-[80%] text-[#92A7BE] group-hover:text-[#0e1721] px-4 py-4 text-sm text-left bg-surface-100 border  border-[#92A7BE] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
            >
              {selectedCity || city0ptions[0]}
              <span className="">
                <IoIosArrowDown />
              </span>
            </button>

            {isCityOpen && (
              <div className="absolute z-10 w-[200px] mt-1 bg-surface-100 border rounded-lg shadow-lg transition-opacity duration-300 ease-in-out">
                {city0ptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleCitySelect(option)}
                    className="p-2 cursor-pointer "
                  >
                    <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                      {option}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <button
              onClick={toggleLocationOpen}
              className="flex justify-between items-center md:w-[200px] text-[#92A7BE] group-hover:text-[#0e1721] px-4 py-4 text-sm text-left bg-surface-100 border  border-[#92A7BE] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
            >
              {selectedLocation || location0ptions[0]}
              <span className="">
                <IoIosArrowDown />
              </span>
            </button>

            {isLocationOpen && (
              <div className="absolute z-10 w-[200px] mt-1 bg-surface-100 border rounded-lg shadow-lg transition-opacity duration-300 ease-in-out">
                {location0ptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(option)}
                    className="p-2 cursor-pointer "
                  >
                    <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                      {option}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <button
              onClick={toggleBatchOpen}
              className="flex justify-between items-center md:w-[200px] text-[#92A7BE] group-hover:text-[#0e1721] px-4 py-4 text-sm text-left bg-surface-100 border  border-[#92A7BE] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
            >
              {selectedBatch || batch0ptions[0]}
              <span className="">
                <IoIosArrowDown />
              </span>
            </button>

            {isBatchOpen && (
              <div className="absolute z-10 w-[200px] mt-1 bg-surface-100 border rounded-lg shadow-lg transition-opacity duration-300 ease-in-out">
                {batch0ptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleBatchSelect(option)}
                    className="p-2 cursor-pointer "
                  >
                    <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                      {option}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <button className="text-[#fff] bg-[#03A1D8] p-4 rounded-lg">
              Create a new session
            </button>
          </div>
        </div>
      </div>
      <div>
        <SessionsTable />
      </div>
      </div>
      <div>
        {/* <SessionCreationModal /> */}
      </div>
    </div>
  );
}
