"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  IoIosArrowDown,
  IoIosCloseCircleOutline,
  IoMdClose,
} from "react-icons/io";
import SessionsTable from "@/components/SessionsTable";
import SessionCreationModal from "@/components/Modal/SessionCreationModal";
import { useSidebar } from "@/providers/useSidebar";
import { listAllSessions, listAllLocations, listAllBatches } from "@/api/route";
import useClickOutside from "@/providers/useClickOutside";
import { CircularProgress } from "@mui/material";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 845);
  const [selectedCity, setSelectedCity] = useState("select city");
  const [selectedLocation, setSelectedLocation] = useState("Select location");
  const [selectedBatch, setSelectedBatch] = useState("select batch");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [loadingBatch, setLoadingBatch] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [LocationOptions, setLocationOptions] = useState([]);
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [isBatchSelected, setIsBatchSelected] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [updateSession, setUpdateSession] = useState(false);
  const [filterLocation, setfilterLocation] = useState([]);
  const dropdownRef = useRef(null);

  // Update states based on screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 845;
      // setIsMobile(mobile);
      // Update initial states based on screen size
      // setSelectedCity(mobile ? "city" : "Select your city");
      // setSelectedLocation(mobile ? "location" : "Location");
      // setSelectedBatch(mobile ? "batch" : "Select your batch");
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useClickOutside(dropdownRef, () => {
    setIsBatchOpen(false);
    setIsCityOpen(false);
    setIsLocationOpen(false);
  });

  const handleListingAllSessions = async () => {
    setLoading(true);
    try {
      const response = await listAllSessions();
      // console.log("session fetching", response?.data);
      setSessions(response?.data.data);
    } catch (error) {
      console.log(
        "error while fetching the class schedules",
        error.response.data.message
      );
      if (error.message === "Network Error") {
        toast.error(error.message, "Check your internet connection");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filteredList = sessions.filter((session) =>
      session.location_name
        .toLowerCase()
        .includes(selectedLocation.toLowerCase())
    );
    setfilterLocation(filteredList);
  }, [selectedLocation]);

  useEffect(() => {
    handleListingAllSessions();
  }, [updateSession]);

  const getBatch = async () => {
    try {
      const response = await listAllBatches();
      console.log("batches", response?.data);
      const batchOptionsArray = response?.data.map((batch) => batch.batch);
      setBatchOptions(batchOptionsArray);
    } catch (error) {
      console.log("error while fetching the batches", error);
      if (error.message === "Network Error") {
        toast.error(error.message, "Check your internet connection");
      }
    } finally {
      setLoadingBatch(false);
    }
  };

  const getLocation = async () => {
    try {
      const response = await listAllLocations();
      console.log("locations", response?.data);
      const LocationOptionsArray = response?.data.map((location) => ({
        id: location.id,
        name: location.name,
        city: location.city,
      }));
      setLocationOptions(LocationOptionsArray);
    } catch (error) {
      console.log("error while fetching the locations", error);
      if (error.message === "Network Error") {
        toast.error(error.message, "Check your internet connection");
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    getBatch();
    getLocation();
  }, [openModal]);

  const toggleCityOpen = () => setIsCityOpen(!isCityOpen);
  const toggleLocationOpen = () => setIsLocationOpen(!isLocationOpen);
  const toggleBatchOpen = () => setIsBatchOpen(!isBatchOpen);

  useEffect(() => {}, []);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsCityOpen(false);
    setIsCitySelected(true);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.name);
    setSelectedLocationId(location.id); // Store the ID for later use
    setIsLocationOpen(false);
    setIsLocationSelected(true);
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch.name);
    setIsBatchOpen(false);
    setIsBatchSelected(true);
  };

  const clearLocationFilter = () => {
    setSelectedLocation("Select location");
    setIsLocationSelected(false);
    setIsLocationOpen(false);
  };

  const handleOpenSessionModal = () => setOpenModal(true);

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 xxlg:px-8 px-3"
      }`}
      style={{ width: isSidebarOpen ? "81%" : "100%" }}
    >
      <div className="bg-surface-100 p-6 rounded-xl">
        <div className="w-full flex xlg:flex-row flex-col justify-between items-center gap-4">
          <div>
            <p className="font-bold text-xl font-exo">Class Details</p>
          </div>
          <div className="flex gap-3 sm:flex-row flex-col text-base lg:text-sm">
            <div className="flex gap-3 ">
              {/* City Dropdown */}
              {/* <div>
                <button
                  onClick={toggleCityOpen}
                  className={`${
                    !isCitySelected ? " text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between items-center md:w-[200px] w-[80%] hover:text-[#0e1721] p-4 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedCity}
                  {isCitySelected && (
                    <span
                      onClick={clearCityFilter}
                      className="ml-2 text-red-500 cursor-pointer"
                    >
                      <IoMdClose />
                    </span>
                  )}
                  <span
                    className={`ml-auto ${
                      isCityOpen ? "rotate-180 duration-300" : "duration-300"
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {isCityOpen && (
                  <div
                    ref={cityDown}
                    className="absolute z-10 w-[200px] mt-1 bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {cityOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleCitySelect(option)}
                        className="p-2 cursor-pointer"
                      >
                        <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                          {option.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div> */}

              {/* Location Dropdown  */}
              <div>
                <button
                  onClick={toggleLocationOpen}
                  className={`${
                    !isLocationSelected ? " text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between items-center w-full  lg:w-[200px] gap-1 hover:text-[#0e1721] px-4 xlg:py-4 py-3 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedLocation}
                  {isLocationSelected && (
                    <span
                      onClick={clearLocationFilter}
                      className="ml-2 text-red-500 cursor-pointer"
                    >
                      <IoIosCloseCircleOutline size={20} />
                    </span>
                  )}
                  <span className="">
                    <IoIosArrowDown />
                  </span>
                </button>
                {isLocationOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 w-[200px] max-h-[250px] overflow-auto scrollbar-webkit mt-1 bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {LocationOptions && LocationOptions.length > 0 ? (
                      // Filter duplicates based on both name and city
                      [
                        ...new Map(
                          LocationOptions.map((item) => [
                            `${item.name}-${item.city}`,
                            item,
                          ])
                        ).values(),
                      ].map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleLocationSelect(option)}
                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                            {option.name} - {option.city}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[12px] text-dark-400 text-center p-1">
                        No location available
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Batch Dropdown *
              <div>
                <button
                  onClick={toggleBatchOpen}
                  className={`${
                    !isBatchSelected ? " text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between items-center w-full lg:w-[200px] gap-1 hover:text-[#0e1721] px-4 xlg:py-4 py-3 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                  >
                  {selectedBatch}
                  <span className="">
                    <IoIosArrowDown />
                  </span>
                </button>

                {isBatchOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 w-[200px] max-h-[200px] overflow-auto scrollbar-webkit mt-1 bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {batchOptions && batchOptions.length > 0 ? (
                      batchOptions.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleBatchSelect(option)}
                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                            {option}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[12px] text-dark-400 text-center p-1">
                        No batch found
                      </p>
                    )}
                  </div>
                )}
              </div> */}
            </div>
            {/* Create Session Button */}
            <div>
              <button
                className="text-[#fff] bg-[#03A1D8] md:w-[200px] px-4 xlg:py-4 py-3 w-full rounded-lg"
                onClick={handleOpenSessionModal}
              >
                Schedule a new class
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div>
          {isLocationSelected && filterLocation.length > 0 ? (
            <SessionsTable
              sessions={filterLocation}
              loading={loading}
              setLoading={setLoading}
              setUpdateSession={setUpdateSession}
              updateSession={updateSession}
            />
          ) : !isLocationSelected && sessions.length > 0 ? (
            <SessionsTable
              sessions={sessions}
              loading={loading}
              setLoading={setLoading}
              setUpdateSession={setUpdateSession}
              updateSession={updateSession}
            />
          ) : (
            <p>No class is scheduled in this location</p>
          )}
        </div>
      </div>

      {/* Session Creation Modal */}
      <div>
        {openModal && (
          <SessionCreationModal
            setOpenModal={setOpenModal}
            LocationOptions={LocationOptions}
            batchOptions={batchOptions}
            loadingLocation={loadingLocation}
            setUpdateSession={setUpdateSession}
            updateSession={updateSession}
            loadingBatch={loadingBatch}
          />
        )}
      </div>
    </div>
  );
}
