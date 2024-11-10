"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSidebar } from "@/providers/useSidebar";
import BatchTable from "@/components/BatchTable";
import BatchModal from "@/components/Modal/BatchModal";
import { DeleteBatch, filterByCity, listAllBatches } from "@/api/route";
import cityAreas from "../../../public/data/cityAreas.json";
import useClickOutside from "@/providers/useClickOutside";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import DeleteConfirmationPopup from "@/components/Modal/DeleteConfirmationPopUp";
import { FaPlus } from "react-icons/fa";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const [selectedCity, setSelectedCity] = useState("Select city");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateBatch, setUpdateBatch] = useState(false);
  const [city0ptions, setCityOptions] = useState([]);
  const [isCitySelected, setIscitySelected] = useState(false);
  const [filterCity, setFilterCity] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const mousedown = useRef(null);
  const mouseButton = useRef(null);

  useClickOutside(mousedown, mouseButton, () => setIsCityOpen(false));

  const handleListingAllBatches = async () => {
    try {
      const response = await listAllBatches();
      console.log("batches", response?.data);
      setBatches(response?.data);
      setCityOptions(cityAreas);
      setLoading(false);
    } catch (error) {
      console.log("error while fetching the batches", error);
      if (error.message === "Network Error") {
        toast.error(error.message, "Check your internet connection");
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    handleListingAllBatches();
  }, [updateBatch]);

  useEffect(() => {
    const filteredList = batches.filter((batch) =>
      batch.city.toLowerCase().includes(selectedCity.toLowerCase())
    );
    setFilterCity(filteredList);
  }, [selectedCity, batches]);

  const handleResetFilter = () => {
    setSelectedCity("Select city");
    setUpdateBatch(true);
    setIscitySelected(false);
  };

  const toggleCityOpen = () => {
    setIsCityOpen(!isCityOpen);
  };

  const handleCitySelect = (option) => {
    setSelectedCity(option);
    setIsCityOpen(false);
    setIscitySelected(true);
  };

  const handleBatchCreate = () => {
    setIsOpenModal(!isOpenModal);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await DeleteBatch(selectedBatch);
      toast.success("Batch deleted successfully!");
      console.log("deleting the batch", response);
      setUpdateBatch(!updateBatch);
      setConfirmDelete(false);
      setLoading(false);
    } catch (error) {
      console.log("error while deleting the batch", error);
    }
  };

  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-22 font-inter ${
          isSidebarOpen
            ? "translate-x-64 ml-20 "
            : "translate-x-0 sm:pl-5 px-4 sm:pr-5"
        }`}
        style={{
          width: isSidebarOpen ? "81%" : "100%",
        }}
      >
        <div className="bg-surface-100 p-6 rounded-xl">
          <div className="w-full mx-auto flex xsm:flex-row flex-col justify-between items-center gap-4 max-md:flex-col">
            <div>
              <p className="font-bold text-blue-500 text-xl font-exo">
                Batch Details
              </p>
            </div>
            <div className="flex gap-3 ">
              <div className="relative">
                <button
                  ref={mouseButton}
                  onClick={toggleCityOpen}
                  className={`${
                    !isCitySelected ? " text-dark-500" : "text-[#424b55]"
                  } flex justify-between items-center  md:w-[200px] sm:w-[150px] w-full  hover:text-[#0e1721] sm:p-4 px-2 py-3 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedCity}
                  {isCitySelected && (
                    <span className="text-dark-400" onClick={handleResetFilter}>
                      <IoIosCloseCircleOutline size={20} />
                    </span>
                  )}
                  <span
                    className={`${
                      isCityOpen ? "rotate-180 duration-300" : "duration-300"
                    } pl-1`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {isCityOpen && (
                  <div
                    ref={mousedown}
                    className={`absolute z-20 w-full mt-1 max-h-[250px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out`}
                    // style={{
                    //   height:
                    //     batches.length * 40 < 300
                    //       ? `${batches.length * 40}px`
                    //       : "300px",
                    //   maxHeight: "300px",
                    //   overflowY: batches.length * 40 > 300 ? "auto" : "unset", // Enable scrolling only if list exceeds 300px
                    // }}
                  >
                    {[...new Set(batches.map((option) => option.city))].map(
                      (city, index) => (
                        <div
                          key={index}
                          onClick={() => handleCitySelect(city)}
                          className="p-2 cursor-pointer"
                        >
                          <div className=" sm:px-4 px-1 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                            {city}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
              {/* <div>
              <button
                onClick={toggleLocationOpen}
                className="flex justify-between items-center md:w-[200px] text-dark-500 group-hover:text-[#0e1721] px-4 py-4 text-sm text-left bg-surface-100 border  border-dark-500 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
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
                      <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                        {option}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
              {/* <div>
              <button
                onClick={toggleBatchOpen}
                className="flex justify-between items-center md:w-[200px] text-dark-500 group-hover:text-[#0e1721] px-4 py-4 text-sm text-left bg-surface-100 border  border-dark-500 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
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
                      <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                        {option}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
              <div>
                <button
                  className="text-[#fff] bg-blue-300 hover:bg-[#3272b6] text-sm sm:p-4 px-3 py-3 md:px-6 rounded-lg hover:cursor-pointer"
                  onClick={handleBatchCreate}
                >
                  <span className="flex justify-center items-center gap-2">
                    <FaPlus />
                    <p className=" sm:flex ">
                      Create <span className="sm:flex hidden px-1">a new </span>{" "}
                      batch
                    </p>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div>
            {isCitySelected && filterCity.length > 0 ? (
              <div className="mt-4">
                <BatchTable
                  batches={filterCity}
                  setUpdateBatch={setUpdateBatch}
                  updateBatch={updateBatch}
                  loading={loading}
                  setLoading={setLoading}
                  setSelectedBatch={setSelectedBatch}
                  setConfirmDelete={setConfirmDelete}
                  selectedBatch={selectedBatch}
                  confirmDelete={confirmDelete}
                />
              </div>
            ) : !isCitySelected && batches.length > 0 ? (
              <div className="mt-4">
                <BatchTable
                  batches={batches}
                  setUpdateBatch={setUpdateBatch}
                  updateBatch={updateBatch}
                  loading={loading}
                  setLoading={setLoading}
                  setSelectedBatch={setSelectedBatch}
                  setConfirmDelete={setConfirmDelete}
                  selectedBatch={selectedBatch}
                  confirmDelete={confirmDelete}
                />
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center w-full p-4">
                <CircularProgress size={20} />
              </div>
            ) : (
              <p>No Batch found in this city</p>
            )}
          </div>
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
      <div>
        {confirmDelete && (
          <DeleteConfirmationPopup
            setConfirmDelete={setConfirmDelete}
            handleDelete={handleDelete}
            field="batch"
          />
        )}
      </div>
    </>
  );
}
