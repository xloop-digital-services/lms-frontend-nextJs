"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import LocationsTable from "@/components/LocationsTable";
import { listAllLocations } from "@/api/route";
import LocationModal from "@/components/Modal/LocationModal";
import cityAreas from "../../../public/data/cityAreas.json";
import useClickOutside from "@/providers/useClickOutside";
import { toast } from "react-toastify";
import { IoIosArrowDown, IoIosCloseCircleOutline, IoMdClose } from "react-icons/io";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const [selectedCity, setSelectedCity] = useState("select city");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [isCitySelected, setIsCitySelected] = useState(false); // Fix typo
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
      console.log("Error fetching locations", error);
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
    setSelectedCity(option.name);
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
  }, [selectedCity, locations]);

  const clearCityFilter = () => {
    setSelectedCity("select city");
    setIsCitySelected(false);
  };

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        width: isSidebarOpen ? "81%" : "100%",
      }}
    >
      <div className="bg-surface-100 p-6 rounded-xl">
        <div className="w-full flex justify-between items-center gap-4">
          <div>
            <p className="font-bold text-xl">Locations Details</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
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
                    <IoIosCloseCircleOutline size={20}  />
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
            </div>
            <div>
              <button
                className="text-[#fff] bg-[#03A1D8] p-4 md:px-8 rounded-lg hover:cursor-pointer"
                onClick={handleLocationCreate}
              >
                Create a new location
              </button>
            </div>
          </div>
        </div>
        {isCitySelected && (
          filteredCityList.length > 0 ? (
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
          )
        )  } {
          !isCitySelected && filteredCityList.length === 0 && locations.length > 0 && (
            <LocationsTable
              locations={locations}
              loading={loading}
              setLoading={setLoading}
              setUpdateLocation={setUpdateLocation}
              updateLocation={updateLocation}
            />
          )}
       
      </div>
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
  );
}
