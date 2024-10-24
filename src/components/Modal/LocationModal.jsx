import { createLocation } from "@/api/route";
import useClickOutside from "@/providers/useClickOutside";
import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const LocationModal = ({
  updateLocation,
  setOpenModal,
  setUpdateLocation,
  cityOptions,
  loading,
  setLoading,
}) => {
  const [allLocations, setAllLocations] = useState([]);
  const [locationName, setLocationName] = useState("Select location");
  const [locationCode, setLocationCode] = useState("");
  const [city, setCity] = useState("Select city");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isCitySelected, setIscitySelected] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [capacity, setCapacity] = useState(null);
  const [error, setError] = useState("");

  const cityDown = useRef(null);
  const modalDown = useRef(null);

  useClickOutside(cityDown, () => {
    setIsCityOpen(false);
    setIsLocationOpen(false);
  });

  useClickOutside(modalDown, () => setOpenModal(false));

  // //console.log('in the modal', cityOptions)

  const handlLocationCreation = async () => {
    setLoading(true);
    if (error) {
      toast.error("Capacity must be a positive value"); // Display the error toast
      setLoading(false); // Set loading to false
      return; // Stop further execution
    }
    if (city && capacity && locationName && locationCode) {
      try {
        const data = {
          name: locationName,
          shortname: locationCode,
          capacity: capacity,
          city: city,
        };
        const response = await createLocation(data);
        if (response.data.status_code === 201) {
          //console.log("location created", response?.data?.message);
          toast.success("Location created successfully!");
          setUpdateLocation(!updateLocation);
          setLoading(false);
          setOpenModal(false);
        }

        if (response.data.code === "token_not_valid") {
          toast.error("Your session has been expired. Log In again!");
          setLoading(false);
          setOpenModal(false);
        }
      } catch (error) {
        //console.log(
        //   "error while location creation",
        //   error?.response?.data?.message
        // );
        if (error.response.status === 400) {
          toast.error(error?.response?.data?.message);
        }
        setLoading(false);
      }
    } else {
      toast.error("All fields are required!");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Check if the value contains invalid characters
    if (/[-]/.test(value)) {
      setError("Invalid value");
    } else {
      setError(""); // Clear error if no invalid characters are present
      setCapacity(value); // Update capacity only when valid
    }
  };

  const toggleCityOpen = () => {
    setIsCityOpen(!isCityOpen);
  };

  const handleCitySelect = (option) => {
    setCity(option.name);
    setLocationName("Select location");
    setIsCityOpen(false);
    setIscitySelected(true);
    setAllLocations(option.areas);
  };

  const toggleLocationOpen = () => {
    setIsLocationOpen(!isLocationOpen);
  };

  const handleLocationSelect = (option) => {
    setLocationName(option.name);
    setLocationCode(option.shortName);
    setIsLocationOpen(false);
    setIsLocationSelected(true);
  };

  return (
    <div className="backDropOverlay h-screen flex justify-center items-center overflow-y-hidden ">
      <div className="w-[550px] z-[1000] mx-auto ">
        {loading && (
          <div className="absolute inset-0 w-full p-2 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
            <CircularProgress size={30} />
          </div>
        )}
        <div
          ref={modalDown}
          style={{ backgroundColor: "#EBF6FF" }}
          className="p-5 rounded-xl"
        >
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#022567",
              }}
              className="text-start  px-2 py-[10px]"
            >
              Location Creation
            </h1>
            <button className="px-2" onClick={() => setOpenModal(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div className={`bg-surface-100 p-6 rounded-xl space-y-5`}>
            <div className="flex gap-3 mx-auto w-full justify-between">
              <div className="space-y-2 text-[15px] w-full">
                <p>City</p>
                <div>
                  <button
                    onClick={toggleCityOpen}
                    className={`${
                      !isCitySelected ? " text-[#92A7BE]" : "text-[#424b55]"
                    } flex justify-between items-center  md:w-[220px]  w-[80%]  hover:text-[#0e1721] p-4 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                  >
                    {city}
                    <span className="">
                      <IoIosArrowDown />
                    </span>
                  </button>

                  {isCityOpen && (
                    <div
                      ref={cityDown}
                      className="absolute z-10 w-[220px] mt-1 max-h-[170px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                    >
                      {cityOptions.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleCitySelect(option)}
                          className="p-2 cursor-pointer "
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                            {option.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-[15px] w-full">
                <p>Location</p>
                <div>
                  <button
                    onClick={toggleLocationOpen}
                    className={`${
                      !isLocationSelected ? " text-[#92A7BE]" : "text-[#424b55]"
                    } flex justify-between items-center  md:w-[220px]  w-[80%]  hover:text-[#0e1721] p-4 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                  >
                    {locationName}
                    <span className="">
                      <IoIosArrowDown />
                    </span>
                  </button>

                  {isLocationOpen && allLocations.length > 0 ? (
                    <div
                      ref={cityDown}
                      className="absolute z-10 w-[220px] mt-1 max-h-[170px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                    >
                      {allLocations.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleLocationSelect(option)}
                          className="p-2 cursor-pointer "
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                            {option.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    isLocationOpen &&
                    allLocations.length == 0 && (
                      <div
                        ref={cityDown}
                        className="absolute z-10 w-[220px] mt-1 max-h-[170px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                      >
                        <p className="text-[12px] text-dark-400 text-center p-1">
                          Select your city first
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mx-auto w-full justify-between">
              <div className="space-y-2 text-[15px] w-full">
                <p>Location Code</p>
                <input
                  type="text"
                  className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                  placeholder="Location code"
                  value={locationCode}
                  required
                />
              </div>
              <div className="space-y-2 text-[15px] w-full">
                <p>Capacity</p>
                <input
                  type="number"
                  className="border border-dark-300 text-[#424b55] outline-none p-3 rounded-lg w-full"
                  placeholder="Number of students"
                  value={capacity}
                  min={0}
                  onChange={handleInputChange}
                />
                {error && <p className="text-mix-200 text-[12px]">{error}</p>}{" "}
                {/* Display error message */}
              </div>
            </div>
            <div className="flex w-full justify-center items-center">
              <button
                type="submit"
                onClick={handlLocationCreation}
                className="w-fit flex justify-center py-3 px-12 text-sm font-medium rounded-lg text-dark-100 bg-blue-300 hover:bg-[#3272b6] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                {loading && (
                  <CircularProgress size={19} style={{ color: "#fffff" }} />
                )}{" "}
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
