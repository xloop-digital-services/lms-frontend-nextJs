"use client";

import React, { useState, useRef, useEffect } from "react"; 
import MainCourseCard from "@/components/MainCourseCard"; 
import courseImg from "/public/assets/img/course-image.png"; 
import { IoIosArrowDown } from "react-icons/io";
import QuizTable from "@/components/QuizTable"; 

const DataScreen = ({module}) => {
  const [selectedOption, setSelectedOption] = useState(` ${module} 1`);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); 

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const options = [`${module} 1`, `${module} 2`, `${module} 3`, `${module} 4`];

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
    <div>
      <div className='flex justify-between items-center'>
        <p className='text-[18px] font-exo text-blue-500 font-semibold'>{selectedOption}</p>
        <div className="group relative inline-block w-64" ref={dropdownRef}>
          <button
            onClick={toggleOpen}
            className="w-full flex justify-between items-center text-[#92A7BE] group-hover:text-[#0e1721] px-4 py-4 text-sm text-left bg-white border border-[#92A7BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
          >
            {selectedOption || options[0]}
            <span className=''><IoIosArrowDown /></span>
          </button>

              {isOpen && (
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
              )}
            </div>
          </div>
          <div className='w-full mt-4'>
           <QuizTable />
          </div>
        </div>
   
  )

}

export default DataScreen