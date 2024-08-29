import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

const SessionCreationModal = () => {
  const Location0ptions = ["Karachi", "Lahore"];
  const Batch0ptions = ["Batch 1", "Batch 2"];
  const Program0ptions = ["Program 1", "Program 2"];

  const [selectedLocation, setSelectedLocation] = useState("Location");
  const [selectedBatch, setSelectedBatch] = useState("Batch");
  const [selectedProgram, setSelectedProgram] = useState("Program");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);

  const toggleLocationOpen = () => {
    setIsLocationOpen(!isLocationOpen);
  };

  const toggleBatchOpen = () => {
    setIsBatchOpen(!isBatchOpen);
  };

  const toggleProgramOpen = () => {
    setIsProgramOpen(!isProgramOpen);
  };

  const handleLocationSelect = (option) => {
    setSelectedLocation(option);
    setIsLocationOpen(false);
  };
  const handleBatchSelect = (option) => {
    setSelectedBatch(option);
    setIsBatchOpen(false);
  };
  const handleProgramSelect = (option) => {
    setSelectedProgram(option);
    setIsProgramOpen(false);
  };

  return (
    <div>
      <div className="py-6 space-y-5 text-[#07224D]">
        <div className="flex gap-3 mx-auto w-full justify-between">
          <div className="space-y-2 text-[15px] w-full">
            <p>Program</p>
            <button
              onClick={toggleProgramOpen}
              className="flex justify-between items-center w-full text-[#92A7BE] group-hover:text-[#0e1721] px-4 py-3 text-sm text-left bg-white border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
            >
              {selectedProgram || Program0ptions[0]}
              <span className="">
                <IoIosArrowDown />
              </span>
            </button>

            {isProgramOpen && (
              <div className="absolute z-10 w-[200px] bg-white border rounded-lg shadow-lg transition-opaLocation duration-300 ease-in-out">
                {Program0ptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(option)}
                    className="p-2 cursor-pointer "
                  >
                    <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                      {option}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2 text-[15px] w-full">
            <p>Batch</p>
            <button
              onClick={toggleBatchOpen}
              className="flex justify-between items-center w-full text-[#92A7BE] group-hover:text-[#0e1721] px-4 py-3 text-sm text-left bg-white border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
            >
              {selectedBatch || Batch0ptions[0]}
              <span className="">
                <IoIosArrowDown />
              </span>
            </button>

            {isBatchOpen && (
              <div className="absolute z-10 w-[200px] mt-1 bg-white border rounded-lg shadow-lg transition-opaLocation duration-300 ease-in-out">
                {Batch0ptions.map((option, index) => (
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
        </div>
        <div className="flex gap-3 mx-auto w-full justify-between">
          <div className="space-y-2 text-[15px] w-full">
            <p>Location</p>
            <button
              onClick={toggleLocationOpen}
              className="flex justify-between items-center w-full text-[#92A7BE] group-hover:text-[#0e1721] px-4 py-3 text-sm text-left bg-white border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
            >
              {selectedLocation || Location0ptions[0]}
              <span className="">
                <IoIosArrowDown />
              </span>
            </button>

            {isLocationOpen && (
              <div className="absolute z-10 w-[200px] bg-white border rounded-lg shadow-lg transition-opaLocation duration-300 ease-in-out">
                {Location0ptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(option)}
                    className="p-2 cursor-pointer "
                  >
                    <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                      {option}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2 text-[15px] w-full">
            <p>Capacity</p>
            <input
              type="text"
              className="border border-dark-300 outline-none p-3 rounded-lg w-full "
              placeholder="capacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCreationModal;
