"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import LocationsTable from "@/components/LocationsTable";
import { listAllLocations } from "@/api/route";
import LocationModal from "@/components/Modal/LocationModal";
import cityAreas from "../../../public/data/cityAreas.json";
import useClickOutside from "@/providers/useClickOutside";
import {
  IoIosArrowDown,
  IoIosCloseCircleOutline,
  IoMdClose,
} from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { CircularProgress } from "@mui/material";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const [selectedCity, setSelectedCity] = useState("Select city");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [isCitySelected, setIsCitySelected] = useState(false); 
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [updateLocation, setUpdateLocation] = useState(false);
  const [filteredCityList, setFilteredCityList] = useState([]);
  const cityDown = useRef(null);

  useClickOutside(cityDown, () => setIsCityOpen(false));

  const handleListingAllLocations = async () => {
    try {
      const response = await listAllLocations();
      setLocations(response?.data);
      setCityOptions(cityAreas);
      setLoading(false);
    } catch (error) {
      // console.log("Error fetching locations", error);
      if (error.response.status === 401) {
        toast.error(error.response.data.code, ": Please Log in again");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    handleListingAllLocations();
  }, [updateLocation]);

  const toggleCityOpen = () => {
    setIsCityOpen(!isCityOpen);
  };

  const handleCitySelect = (option) => {
    setSelectedCity(option);
    setIsCityOpen(false);
    setIsCitySelected(true);
  };

  const handleLocationCreate = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    const filteredList = locations.filter((location) =>
      location.city.toLowerCase().includes(selectedCity.toLowerCase())
    );
    setFilteredCityList(filteredList);
  }, [selectedCity]);

  const clearCityFilter = () => {
    setSelectedCity("select city");
    setIsCitySelected(false);
  };

  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-22 font-inter pb-4 ${
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
              <p className="font-bold font-exo text-blue-500 text-xl">
                Locations Details
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={toggleCityOpen}
                  className={`${
                    !isCitySelected ? " text-dark-500" : "text-[#424b55]"
                  } flex justify-between items-center md:w-[200px] sm:w-[150px] w-full  gap-2 hover:text-[#0e1721] sm:p-4 px-2 py-3 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedCity}
                  {isCitySelected && (
                    <span
                      onClick={clearCityFilter}
                      className="ml-2 text-red-500 cursor-pointer"
                    >
                      <IoIosCloseCircleOutline size={20} />
                    </span>
                  )}
                  <span
                    className={` ${
                      isCityOpen ? "rotate-180 duration-300" : "duration-300"
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {isCityOpen && (
                  <div
                    ref={cityDown}
                    className={`absolute z-20 w-full mt-1 max-h-[250px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out`}
                    // style={{
                    //   height:
                    //     locations.length * 40 < 300
                    //       ? `${locations.length * 0}px`
                    //       : "250px",
                    //   // maxHeight: "250px",
                    //   overflowY: locations.length * 40 > 300 ? "auto" : "unset", // Enable scrolling only if list exceeds 300px
                    // }}
                  >
                    {[...new Set(locations.map((option) => option.city))].map(
                      (city, index) => (
                        <div
                          key={index}
                          onClick={() => handleCitySelect(city)}
                          className="p-2 cursor-pointer"
                        >
                          <div className="sm:px-4 px-1 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                            {city}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
              <div>
                <button
                  className="text-[#fff] bg-blue-300 hover:bg-[#3272b6] sm:flex text-sm sm:p-4 px-3 py-3 md:px-6 rounded-lg hover:cursor-pointer"
                  onClick={handleLocationCreate}
                >
                  Create<span className="sm:flex hidden px-1">a new </span>{" "}
                  location
                </button>
              </div>
            </div>
          </div>
          {isCitySelected &&
            (filteredCityList.length > 0 ? (
              <LocationsTable
                locations={filteredCityList}
                loading={loading}
                setLoading={setLoading}
                setUpdateLocation={setUpdateLocation}
                updateLocation={updateLocation}
              />
            ) : (
              <p className="text-dark-400 text-sm">
                No Location is found in this city
              </p>
            ))}{" "}
          {loading ? (
            <div className="flex justify-center items-center w-full p-4">
              <CircularProgress size={20} />
            </div>
          ) : (
            !isCitySelected &&
            filteredCityList.length === 0 &&
            locations.length > 0 && (
              <LocationsTable
                locations={locations}
                loading={loading}
                setLoading={setLoading}
                setUpdateLocation={setUpdateLocation}
                updateLocation={updateLocation}
              />
            )
          )}
        </div>
      </div>
      <div>
        {openModal && (
          <LocationModal
            setOpenModal={setOpenModal}
            setUpdateLocation={setUpdateLocation}
            updateLocation={updateLocation}
            cityOptions={cityOptions}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </>
  );
}