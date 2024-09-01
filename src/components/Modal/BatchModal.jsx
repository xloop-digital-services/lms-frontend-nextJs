import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiArrowDownDoubleFill } from "react-icons/ri";
import SessionCreationModal from "./SessionCreationModal";
import { IoIosArrowDown } from "react-icons/io";

const BatchModal = ({ setIsOpenModal }) => {
  const City0ptions = ["Karachi", "Lahore"];
  const [selectedCity, setSelectedCity] = useState("City");
  const [isCityOpen, setIsCityOpen] = useState(false);

  const toggleCityOpen = () => {
      setIsCityOpen(!isCityOpen);
  };
  const handleCitySelect = (option) => {
      setSelectedCity(option);
      setIsCityOpen(false);
  };

  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className="w-[550px] z-[1000] mx-auto my-20">
        <div style={{ backgroundColor: "#EBF6FF" }} className="p-5 rounded-xl">
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#07224D",
              }}
              className="text-start  px-2 py-[10px]"
            >
              Batch Creation
            </h1>
            <button className="px-2" onClick={() => setIsOpenModal(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div className={`bg-surface-100 p-6 rounded-xl space-y-5 `}>
            <div>
              <div className="flex gap-3 mx-auto w-full justify-between">
                <div className="space-y-2 text-[15px] w-full">
                  <p>Batch</p>
                  <input
                    type="text"
                    className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                    placeholder="batch name"
                  />
                </div>
                <div className="space-y-2 text-[15px] w-full">
                  <p>City</p>
                  <button
                    onClick={toggleCityOpen}
                    className="flex justify-between items-center w-full text-[#92A7BE] group-hover:text-[#0e1721] px-4 py-3 text-sm text-left bg-white border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
                  >
                    {selectedCity || City0ptions[0]}
                    <span className="">
                      <IoIosArrowDown />
                    </span>
                  </button>

                  {isCityOpen && (
                    <div className="absolute z-10 w-[200px] bg-white border rounded-lg shadow-lg transition-opaCity duration-300 ease-in-out">
                      {City0ptions.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleCitySelect(option)}
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
              </div>
            </div>
            <div className="flex gap-3 mx-auto w-full justify-between">
              <div className="space-y-2 text-[15px] w-full">
                <p>Location</p>
                <div className="border border-dark-300 p-3 rounded-lg flex gap-2">
                  <button className="text-dark-300 hover:text-dark-400 px-1 border border-dark-200 rounded-lg hover:border-dark-400">+</button>
                <input
                  type="text"
                  className=" outline-none w-full  "
                  placeholder="location"
                />
                </div>
              </div>
              <div className="space-y-2 text-[15px] w-full">
                <p>Number of Students</p>
                <input
                  type="text"
                  className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                  placeholder="number of students"
                />
              </div>
            </div>
            <div className="flex gap-3 mx-auto w-full justify-between">
              <div className="space-y-2 text-[15px] w-full">
                <p>Start Date</p>
                <input
                  type="text"
                  className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                  placeholder="select start date"
                />
              </div>
              <div className="space-y-2 text-[15px] w-full">
                <p>End Date</p>
                <input
                  type="text"
                  className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                  placeholder="select end date"
                />
              </div>
            </div>
            <div className="flex gap-3 mx-auto w-full justify-between">
              <div className="space-y-2 text-[15px] w-full">
                <p>Year</p>
                <input
                  type="text"
                  className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                  placeholder="b"
                />
              </div>
              <div className="space-y-2 text-[15px] w-full">
                <p>Category</p>
                <input
                  type="text"
                  className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                  placeholder="capacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchModal;
