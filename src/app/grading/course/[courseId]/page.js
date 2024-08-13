"use client";
import React, { useState, useRef, useEffect } from "react"; // Ensure useState is imported
import TopPart from "@/components/CourseHead";
import { IoIosArrowDown } from "react-icons/io"; // Import the icon
import PerformanceTable from "@/components/PerformanceTable";
import { useSidebar } from "@/providers/useSidebar";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const [selectedOption, setSelectedOption] = useState("Hammad Siddiqui"); // Initialize state
  const [isOpen, setIsOpen] = useState(false); // Initialize another state
  const dropdownRef = useRef(null); // Reference for the dropdown div

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const options = ['Hammad Siddiqui', 'Javeria Lodhi', 'Sarah Patel', 'Hira Fatima']; // Define your options

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-20 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "84%" : "100%",
      }}
    >
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <TopPart />
        <div>
          <div className='flex justify-between items-center'>
            <p className='text-[18px] font-semibold'>{selectedOption}</p>
            <div className="group relative inline-block w-64" ref={dropdownRef}>
              <button
                onClick={toggleOpen}
                className="w-full flex justify-between items-center text-[#92A7BE] group-hover:text-[#0e1721] px-4 py-4 text-sm text-left bg-white border border-[#92A7BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
              >
                {selectedOption || options[0]}
                <span className=''><IoIosArrowDown /></span>
              </button>

              {/* {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      className="p-2 cursor-pointer "
                    >
                      <div className='px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg'>
                        {option}
                      </div>
                    </div>
                  ))}
                </div>
              )} */}
            </div>
          </div>
          <div className="my-5 space-y-3">
          <div className="border border-dark-300 w-full p-4 rounded-lg flex justify-between items-center">
            <p className="text-[17px] font-semibold font-exo">Quiz</p>
            <span className=''><IoIosArrowDown /></span>
          </div>
          <div className="border border-dark-300 w-full p-4 rounded-lg flex justify-between items-center">
            <p className="text-[17px] font-semibold font-exo">Assignments</p>
            <span className=''><IoIosArrowDown /></span>
          </div>
          <div className="border border-dark-300 w-full p-4 rounded-lg flex justify-between items-center">
            <p className="text-[17px] font-semibold font-exo">Projects</p>
            <span className=''><IoIosArrowDown /></span>
          </div>
          <div className="border border-dark-300 w-full p-4 rounded-lg flex justify-between items-center">
            <p className="text-[17px] font-semibold font-exo">Exam</p>
            <span className=''><IoIosArrowDown /></span>
          </div>
          </div>
          <div>
            <div className="font-semibold font-exo py-3">Student Performance Overview</div>
            <PerformanceTable />
          </div>
        </div>
      </div>
    </div>
  );
}
