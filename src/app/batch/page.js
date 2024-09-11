"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSidebar } from "@/providers/useSidebar";
import BatchTable from "@/components/BatchTable";
import BatchModal from "@/components/Modal/BatchModal";
import { filterByCity, listAllBatches } from "@/api/route";
import cityAreas from "../../../public/data/cityAreas.json";
import useClickOutside from "@/providers/useClickOutside";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const [selectedCity, setSelectedCity] = useState("Select your city");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateBatch, setUpdateBatch] = useState(false);
  const [city0ptions, setCityOptions] = useState([]);
  const [isCitySelected, setIscitySelected] = useState(false);
  const [filterCity, setFilterCity] = useState([]);
  const mousedown = useRef(null);

  useClickOutside(mousedown, () => setIsCityOpen(false));

  const handleListingAllBatches = async () => {
    try {
      const response = await listAllBatches();
      console.log("batches", response?.data);
      setBatches(response?.data);
      setCityOptions(cityAreas);
      setLoading(false);
    } catch (error) {
      console.log("error while fetching the batches", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    handleListingAllBatches();
  }, [updateBatch]);

  // useEffect(() => {
  //   console.log("city of areas", cityAreas);
    
  // }, []);

  //filter by city
  // useEffect(() => {
  //   const handleFilterByCity = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await filterByCity(selectedCity);
  //       console.log("filteration success", response);
  //       setBatches(response?.data?.locations);
  //       setLoading(false);
  //     } catch (error) {
  //       console.log("error while filtering by city", error);
  //       setLoading(false);
  //     }
  //   };
  //   handleFilterByCity();
  // }, [selectedCity]);

  const handleResetFilter = () => {
    setSelectedCity("Select your city");
    setUpdateBatch(true);
  };

  const toggleCityOpen = () => {
    setIsCityOpen(!isCityOpen);
  };

  const handleCitySelect = (option) => {
    setSelectedCity(option.name);
    setIsCityOpen(false);
    setIscitySelected(true);
  };

  const handleBatchCreate = () => {
    setIsOpenModal(!isOpenModal);
  };

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-22 font-inter ${
        isSidebarOpen
          ? "translate-x-64 pl-20 "
          : "translate-x-0 sm:pl-5 px-4 sm:pr-5"
      }`}
      style={{
        width: isSidebarOpen ? "84%" : "100%",
      }}
    >
      <div className="bg-surface-100 p-6 rounded-xl">
        <div className="w-full mx-auto flex sm:flex-row flex-col sm:justify-between items-center  gap-4">
          <div>
            <p className="font-bold text-xl">Batch Details</p>
          </div>
          <div className="flex gap-3">
            {/* <div>
              <button
                onClick={toggleCityOpen}
                className={`${
                  !isCitySelected ? " text-[#92A7BE]" : "text-[#424b55]"
                } flex justify-between items-center  sm:w-[200px]   hover:text-[#0e1721] sm:p-4 px-2 py-3 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
              >
                {selectedCity || city0ptions[0] } 
                {isCitySelected && <span className="text-dark-400" onClick={handleResetFilter}><IoIosCloseCircleOutline size={20} /></span>} 
                <span className="pl-1">
                  <IoIosArrowDown />
                </span>
              </button>

              {isCityOpen && (
                <div
                  ref={mousedown}
                  className="absolute z-10 sm:w-[200px] sm:h-full  max-h-[400px] overflow-auto scrollbar-webkit mt-1 bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                >
                  {city0ptions.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleCitySelect(option)}
                      className="p-2 cursor-pointer "
                    >
                      <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                        {option.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
            {/* <div>
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
            </div> */}
            <div>
              <button
                className="text-[#fff] bg-[#03A1D8] sm:flex text-sm sm:p-4 px-3 py-3 md:px-8 rounded-lg hover:cursor-pointer"
                onClick={handleBatchCreate}
              >
                Create <span className="sm:flex hidden px-1">a new </span> batch
              </button>
            </div>
          </div>
        </div>
        <div>
          <BatchTable batches={batches} loading={loading} />
        </div>
      </div>
      <div>
        {isOpenModal && (
          <BatchModal
            setIsOpenModal={setIsOpenModal}
            setUpdateBatch={setUpdateBatch}
            cityOptions={city0ptions}
            updateBatch={updateBatch}
          />
        )}
      </div>
    </div>
  );
}
