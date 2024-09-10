"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSidebar } from "@/providers/useSidebar";
import LocationsTable from "@/components/LocationsTable";
import { listAllLocations } from "@/api/route";
import LocationModal from "@/components/Modal/LocationModal";
import cityAreas from "../../../public/data/cityAreas.json"
import useClickOutside from "@/providers/useClickOutside";

export default function Page() {
    const { isSidebarOpen } = useSidebar();
    const [selectedCity, setSelectedCity] = useState("Select your city");
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [city0ptions, setCityOptions] = useState([])
    const [isCitySelected, setIscitySelected] = useState(false)
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const [updateLocation, setUpdateLocation] = useState(false)
    const cityDown = useRef(null)

  useClickOutside(cityDown, () => setIsCityOpen(false))


    const handleListingAllLocations = async () => {
      try {
        const response = await listAllLocations();
        console.log('fetch all locations', response?.data)
        setLocations(response?.data)
        setLoading(false)
      } catch (error) {
        console.log('error, while fetching the locations', error)
        setLoading(false)
      }
    }

    useEffect(()=>{
      handleListingAllLocations();
     
    },[updateLocation])

    useEffect(()=> { 
      // console.log('city of areas',cityAreas)
      setCityOptions(cityAreas)
    }, [])

    const toggleCityOpen = () => {
        setIsCityOpen(!isCityOpen);
      };
    
      const handleCitySelect = (option) => {
        setSelectedCity(option.name);
        setIsCityOpen(false);
        setIscitySelected(true)
      };
    

      const handleLocationCreate = () => {
        setOpenModal(true)
      }

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        width: isSidebarOpen ? "84%" : "100%",
      }}
    >
      <div className="bg-surface-100 p-6 rounded-xl">
        <div className="w-full flex justify-between items-center  gap-4">
          <div>
            <p className="font-bold text-xl">Locations Details</p>
          </div>
          <div className="flex gap-3">
            {/* <div>
              <button
                onClick={toggleCityOpen}
                className={`${
                  !isCitySelected ? " text-[#92A7BE]" : "text-[#424b55]"
                } flex justify-between items-center  md:w-[200px] w-[80%]  hover:text-[#0e1721] p-4 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}              >
                {selectedCity || city0ptions[0]}
                <span className="">
                  <IoIosArrowDown />
                </span>
              </button>

              {isCityOpen && (
                <div ref={cityDown} className="absolute z-10 w-[200px] mt-1 bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out">
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
        <LocationsTable locations={locations} loading={loading} />
      </div>
      {openModal && <LocationModal 
      setOpenModal={setOpenModal} 
      setUpdateLocation={setUpdateLocation}
      updateLocation={updateLocation}
      city0ptions={city0ptions}
      />}
    </div>
  );
}
