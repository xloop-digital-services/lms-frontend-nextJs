"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  IoIosArrowDown,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import SessionsTable from "@/components/SessionsTable";
import SessionCreationModal from "@/components/Modal/SessionCreationModal";
import { useSidebar } from "@/providers/useSidebar";
import {
  listAllSessions,
  listAllLocations,
  listAllBatches,
  DeleteSession,
} from "@/api/route";
import useClickOutside from "@/providers/useClickOutside";
import { CircularProgress } from "@mui/material";
import DeleteConfirmationPopup from "@/components/Modal/DeleteConfirmationPopUp";
import { toast } from "react-toastify";
import SessionInfoModal from "@/components/Modal/SessionInfoModal";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedCity, setSelectedCity] = useState("select city");
  const [selectedLocation, setSelectedLocation] = useState("Select location");
  const [selectedBatch, setSelectedBatch] = useState("Select batch");
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [session, setSession] = useState(null);
  const dropdownRef = useRef(null);
  const dropButton = useRef(null);
  const batchDrop = useRef(null);
  const batchButton = useRef(null);
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  useClickOutside(dropdownRef, dropButton, () => {
    setIsLocationOpen(false);
  });

  useClickOutside(batchDrop, batchButton, () => {
    setIsBatchOpen(false);
  });

  const handleListingAllSessions = async () => {
    setLoading(true);
    try {
      const response = await listAllSessions();
      // console.log("session fetching", response?.data);
      setSessions(response?.data.data);
    } catch (error) {
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
    let filteredList = sessions;

    if (selectedLocation && !isBatchSelected) {
      filteredList = sessions.filter((session) =>
        session.location_name
          .toLowerCase()
          .includes(selectedLocation.toLowerCase())
      );
    }
    if (selectedBatch && !isLocationSelected) {
      filteredList = sessions.filter((session) =>
        session.batch.toLowerCase().includes(selectedBatch.toLowerCase())
      );
    }

    if (
      selectedBatch &&
      isBatchSelected &&
      selectedLocation &&
      isLocationSelected
    ) {
      filteredList = sessions.filter(
        (session) =>
          session.batch.toLowerCase().includes(selectedBatch.toLowerCase()) &&
          session.location_name
            .toLowerCase()
            .includes(selectedLocation.toLowerCase())
      );
    }

    setfilterLocation(filteredList);
  }, [
    selectedLocation,
    sessions,
    selectedBatch,
    isBatchSelected,
    isLocationSelected,
  ]);

  useEffect(() => {
    handleListingAllSessions();
  }, [updateSession]);

  const getBatch = async () => {
    try {
      const response = await listAllBatches();
      // console.log("batches", response?.data);
      const batchOptionsArray = response?.data.map((batch) => batch.batch);
      setBatchOptions(response?.data);
    } catch (error) {
      // console.log("error while fetching the batches", error);
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
      // console.log("locations", response?.data);
      const LocationOptionsArray = response?.data.map((location) => ({
        id: location.id,
        name: location.name,
        city: location.city,
      }));
      setLocationOptions(LocationOptionsArray);
    } catch (error) {
      // console.log("error while fetching the locations", error);
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
    setSelectedLocation(location.location_name);
    setSelectedLocationId(location.id); 
    setIsLocationOpen(false);
    setIsLocationSelected(true);
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setIsBatchOpen(false);
    setIsBatchSelected(true);
  };

  const clearLocationFilter = () => {
    setSelectedLocation("Select location");
    setIsLocationSelected(false);
    setIsLocationOpen(false);
  };

  const clearBatchFilter = () => {
    setSelectedBatch("Select batch");
    setIsBatchSelected(false);
    setIsBatchOpen(!isBatchOpen);
  };

  const handleOpenSessionModal = () => setOpenModal(true);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await DeleteSession(selectedSession);
      // console.log("deleting the session", response);
      toast.success("Class schedule deleted successfully!");
      setUpdateSession(!updateSession);
      setConfirmDelete(false);
      setLoading(false);
    } catch (error) {
    } finally {
      setLoading(false);
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
        style={{ width: isSidebarOpen ? "81%" : "100%" }}
      >
        <div className="bg-surface-100 p-6 rounded-xl">
          <div className="w-full mx-auto flex smm:flex-row flex-col justify-between items-center gap-4 max-md:flex-col">
            <div className="flex">
              <div
                className="text-dark-400 flex gap-2 items-center cursor-pointer hover:text-blue-300 mr-4"
                onClick={goBack}
              >
                <FaArrowLeft size={20} />
              </div>
              <p className="font-bold text-xl text-blue-500 font-exo">
                Class Details
              </p>
            </div>
            <div className="flex gap-3">
              <div className=" flex gap-3 ">
                <div className="relative">
                  <button
                    ref={dropButton}
                    onClick={toggleLocationOpen}
                    className={`${
                      !isLocationSelected ? " text-dark-500" : "text-[#424b55]"
                    } flex justify-between items-center lg:w-[200px]  w-full  gap-2 hover:text-[#0e1721] sm:p-4 px-2 py-3 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
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
                    <span
                      className={
                        isLocationOpen
                          ? "rotate-180 duration-300"
                          : "duration-300"
                      }
                    >
                      <IoIosArrowDown />
                    </span>
                  </button>
                  {isLocationOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-50 w-full max-h-[250px] overflow-auto scrollbar-webkit mt-1 bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                    >
                      {sessions && sessions.length > 0 ? (
                        [
                          ...new Map(
                            sessions.map((item) => [
                              `${item.location_name}`,
                              item,
                            ])
                          ).values(),
                        ].map((option, index) => (
                          <div
                            key={index}
                            onClick={() => handleLocationSelect(option)}
                            className="p-2 cursor-pointer"
                          >
                            <div className="sm:px-4 px-1 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                              {option.location_name}
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

                {/* Batch Dropdown * */}
                <div className="relative">
                  <button
                    ref={batchButton}
                    onClick={toggleBatchOpen}
                    className={`${
                      !isBatchSelected ? " text-dark-500" : "text-[#424b55]"
                    } flex justify-between items-center lg:w-[200px] w-full gap-1 hover:text-[#0e1721] sm:p-4 px-2 py-3 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                  >
                    <span className="flex gap-1">
                      <span className="max-w-[120px] truncate">
                        {selectedBatch}
                      </span>

                      {isBatchSelected && (
                        <span
                          onClick={clearBatchFilter}
                          className="ml-2 text-red-500 cursor-pointer"
                        >
                          <IoIosCloseCircleOutline size={20} />
                        </span>
                      )}
                    </span>
                    <span
                      className={
                        isBatchOpen ? "rotate-180 duration" : "duration-300"
                      }
                    >
                      <IoIosArrowDown />
                    </span>
                  </button>

                  {isBatchOpen && (
                    <div
                      ref={batchDrop}
                      className="absolute z-50 w-full max-h-[200px] overflow-auto scrollbar-webkit mt-1 bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                    >
                      {sessions.length > 0 ? (
                        [
                          ...new Map(
                            sessions.map((item) => [`${item.batch}`, item])
                          ).values(),
                        ].map((option, index) => (
                          <div
                            key={index}
                            onClick={() => handleBatchSelect(option.batch)}
                            className="p-2 cursor-pointer"
                          >
                            <div className="sm:px-4 px-1 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                              {option.batch}
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
                </div>
              </div>
              {/* Create Session Button */}
              <div>
                <button
                  className="text-[#fff] bg-blue-300 hover:bg-[#3272b6] sm:flex text-sm sm:p-4 px-3 py-3 md:px-6 rounded-lg hover:cursor-pointer"
                  onClick={handleOpenSessionModal}
                >
                  <span className="flex justify-center items-center gap-2 ">
                    <FaPlus />
                    <p className="md:flex">
                      Schedule
                      <span className="md:flex hidden px-1">a new </span> class
                    </p>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Sessions Table */}
          <div>
            {loading ? (
              <div className="flex justify-center items-center w-full p-4">
                <CircularProgress size={20} />
              </div>
            ) : (isLocationSelected || isBatchSelected) &&
              filterLocation.length > 0 ? (
              <SessionsTable
                sessions={filterLocation}
                loading={loading}
                setLoading={setLoading}
                setUpdateSession={setUpdateSession}
                updateSession={updateSession}
                setSelectedSession={setSelectedSession}
                setConfirmDelete={setConfirmDelete}
                selectedSession={selectedSession}
                confirmDelete={confirmDelete}
                setOpenModal={setOpenInfoModal}
                setEdit={setEdit}
                edit={edit}
                session={session}
                setSession={setSession}
              />
            ) : (
              !isLocationSelected &&
              !isBatchSelected &&
              sessions.length > 0 && (
                <SessionsTable
                  sessions={sessions}
                  loading={loading}
                  setLoading={setLoading}
                  setUpdateSession={setUpdateSession}
                  updateSession={updateSession}
                  setSelectedSession={setSelectedSession}
                  setConfirmDelete={setConfirmDelete}
                  selectedSession={selectedSession}
                  confirmDelete={confirmDelete}
                  setOpenModal={setOpenInfoModal}
                  setEdit={setEdit}
                  edit={edit}
                  session={session}
                  setSession={setSession}
                />
              )
            )}
          </div>
        </div>

        {/* Session Creation Modal */}
      </div>
      <div>
        {(openModal || edit) && (
          <SessionCreationModal
            setOpenModal={setOpenModal}
            LocationOptions={LocationOptions}
            batchOptions={batchOptions}
            loadingLocation={loadingLocation}
            setUpdateSession={setUpdateSession}
            updateSession={updateSession}
            loadingBatch={loadingBatch}
            setEdit={setEdit}
            edit={edit}
            session={session}
            selectedSession={selectedSession}
          />
        )}
      </div>
      <div>
        {confirmDelete && (
          <DeleteConfirmationPopup
            setConfirmDelete={setConfirmDelete}
            handleDelete={handleDelete}
            field="session"
          />
        )}
      </div>
      <div>
        {openInfoModal && (
          <SessionInfoModal
            selectedSession={selectedSession}
            setOpenModal={setOpenInfoModal}
          />
        )}
      </div>
    </>
  );
}