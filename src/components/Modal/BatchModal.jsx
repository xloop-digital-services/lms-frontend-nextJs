import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import DatePicker from "react-datepicker";
import { FaCalendar, FaClock } from "react-icons/fa";
import { createBatch } from "@/api/route";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import useClickOutside from "@/providers/useClickOutside";

const BatchModal = ({
  updateBatch,
  setIsOpenModal,
  setUpdateBatch,
  cityOptions,
}) => {
  const [selectedCity, setSelectedCity] = useState("Select city");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [locations, setLocations] = useState([]); // State to store the list of location names
  const [currentLocation, setCurrentLocation] = useState(""); // State to store the current input value
  const inputRef = useRef(null); // Ref to focus the input field
  const [startDate, setstartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [studentCapacity, setStudentCapacity] = useState();
  const [year, setYear] = useState();
  const [loadingCreation, setLoadingCreation] = useState(false);
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [cityShortName, setCityShortName] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Select category");
  const [error, setError] = useState(""); 
  const categoryOptions = [
    { name: "Fall" },
    { name: "Winter" },
    { name: "Spring" },
    { name: "Summer" },
    { name: "Annual" },
  ];
  const cityDown = useRef(null);
  const modalDown = useRef(null);
  const categoryRef = useRef();

  useClickOutside(cityDown, () => setIsCityOpen(false));

  useClickOutside(modalDown, () => setIsOpenModal(false));

  const handleBatchCreation = async () => {
    setLoadingCreation(true);
    if (error) {
      toast.error("Capacity must be a positive value"); // Display the error toast
      setLoadingCreation(false); // Set loading to false
      return; // Stop further execution
    }
    if (
      !errorMessage &&
      selectedCity &&
      cityShortName &&
      year &&
      studentCapacity &&
      startDate &&
      endDate &&
      selectedCategory
    ) {
      try {
        const data = {
          city: selectedCity,
          city_abb: cityShortName,
          year: year,
          no_of_students: studentCapacity,
          start_date: startDate,
          end_date: endDate,
          term: selectedCategory,
        };

        const response = await createBatch(data);
        console.log("batch created", response?.data.message);
        toast.success("Batch created successfully!");
        setLoadingCreation(false);
        setIsOpenModal(false);
        setUpdateBatch(!updateBatch);
      } catch (error) {
        console.log("error is occuring", error.response);
        if (error.response.status === 400) {
          toast.error(error.response.data.error[0]);
        }
        // toast.error(error?.response?.data?.error[0])
        setLoadingCreation(false);
      }
    } else {
      toast.error("All fields are required!");
      setLoadingCreation(false);
    }
  };

  const toggleCategoryOpen = () => {
    setIsCategoryOpen((prev) => !prev);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
    setIsCategoryOpen(false);
  };

  const handleStartDate = (event) => {
    // Check if the date is a valid Date object
    // if (date instanceof Date && !isNaN(date)) {
    //   const formattedDate = date.toISOString().split("T")[0]; // Extract the date part
    //   setstartDate(formattedDate); // Set the start date
    //   // console.log("start date,", date);
    //   console.log("formated start date", formattedDate);
    // } else {
    //   toast.error("Invalid date selected");
    setstartDate(event.target.value);
    // }
  };

  const handleEndDateChange = (event) => {
    // if (date instanceof Date && !isNaN(date)) {
    //   const formattedDate = date.toISOString().split("T")[0]; // Extract the date part
    //   setendDate(formattedDate); // Set the end date
    //   // console.log('end date,', date)
    //   console.log("formated end date", formattedDate);
    setendDate(event.target.value);
    // Check if end date is earlier than start date
    if (startDate && event.target.value <= startDate) {
      setErrorMessage("End date should be greater than start date");
    } else {
      setErrorMessage("");
    }
  };

  // Handle adding a new location
  const handleAddLocation = () => {
    setIsInputActive(true); // Activate the input field
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input field
    }
  };

  // Handle adding location when Enter key is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (currentLocation.trim() !== "") {
        setLocations((prevLocations) => [...prevLocations, currentLocation]); // Add location
        setCurrentLocation(""); // Clear input field
      }
    }
  };

  // Handle removing a location
  const handleRemoveLocation = (index) => {
    setLocations((prevLocations) =>
      prevLocations.filter((_, i) => i !== index)
    ); // Remove location
  };

  const toggleCityOpen = () => {
    setIsCityOpen(!isCityOpen);
  };
  const handleCitySelect = (option) => {
    setSelectedCity(option.name);
    setCityShortName(option.shortName);
    setIsCityOpen(false);
    setIsCitySelected(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Check if the value contains invalid characters
    if (/[-]/.test(value)) {
      setError("Invalid value");
    } else {
      setError(""); // Clear error if no invalid characters are present
      setStudentCapacity(value); // Update capacity only when valid
    }
  };

  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className="w-[550px] z-[1000] mx-auto my-20 ">
        {loadingCreation && (
          <div className="absolute inset-0 w-full p-2 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
            <CircularProgress size={30} />
          </div>
        )}
        <div
          ref={modalDown}
          style={{ backgroundColor: "#EBF6FF" }}
          className="xsm:p-5 p-2 m-2 rounded-xl"
        >
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#07224D",
              }}
              className="text-start  px-2 xsm:py-[10px] pb-[5px]"
            >
              Batch Creation
            </h1>
            <button className="px-2" onClick={() => setIsOpenModal(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div
            className={`bg-surface-100 xsm:p-6 px-3 py-4 rounded-xl xsm:space-y-5 space-y-2`}
          >
            <div className="flex  gap-3 mx-auto w-full justify-between">
              {/* <div className="space-y-2 text-[15px] w-full">
                <p>Batch</p>
                <input
                  type="text"
                  className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                  placeholder="batch name"
                  value={batchName}
                  onChange={(e) => setbatchName(e.target.value)}
                />
              </div>         */}
              <div className="space-y-2 text-[15px] w-full">
                <p>City</p>
                <button
                  onClick={toggleCityOpen}
                  className={`${
                    !isCitySelected ? " text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between items-center w-full  hover:text-[#0e1721] px-4 py-3 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedCity}
                  <span className="">
                    <IoIosArrowDown />
                  </span>
                </button>

                {isCityOpen && (
                  <div
                    ref={cityDown}
                    className="absolute z-10 min-w-[220px] max-h-[170px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opaCity duration-300 ease-in-out"
                  >
                    {cityOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleCitySelect(option)}
                        className="p-2 cursor-pointer "
                      >
                        <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                          {option.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2 text-[15px] w-full">
                <p>Capacity</p>
                <input
                  type="number"
                  className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                  placeholder="Number of students"
                  value={studentCapacity}
                  min={0}
                  onChange={handleInputChange}
                />
                {error && <p className="text-mix-200 text-[12px]">{error}</p>}{" "}
              </div>
            </div>

            <div className="flex xsm:flex-row flex-col gap-3 mx-auto w-full justify-between">
              {/* <div className="space-y-2 text-[15px] w-full">
                <p>Location</p>
                <div
                  className={`border border-dark-300 px-3 ${
                    locations.length > 0 ? "py-2" : "py-3"
                  } rounded-lg flex gap-2`}
                >
                  {/* Add Location Button *
                  <button
                    className="text-dark-300 hover:text-dark-400 px-1 border border-dark-200 rounded-lg hover:border-dark-400"
                    onClick={handleAddLocation}
                  >
                    +
                  </button>
                 Display Added Locations 
                  {locations.map((location, index) => (
                    <div
                      key={index}
                      className="border border-dark-300 p-1 px-2 rounded-lg flex items-center space-x-2"
                    >
                      <span>{location}</span>
                      <button
                        onClick={() => handleRemoveLocation(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  * Input Field *
                  {isInputActive && (
                    <input
                      ref={inputRef}
                      type="text"
                      className="outline-none w-full"
                      placeholder="Enter location"
                      value={currentLocation}
                      onChange={(e) => setCurrentLocation(e.target.value)}
                      onKeyDown={handleKeyPress} // Handle Enter key press
                    />
                  )}
                </div>
              </div> */}
              <div className="space-y-2 text-[15px] w-full relative">
                <p>Category</p>
                <button
                  onClick={toggleCategoryOpen}
                  className={`${
                    selectedCategory === "select category"
                      ? " text-[#92A7BE]"
                      : "text-[#424b55]"
                  } flex justify-between items-center w-full hover:text-[#0e1721] px-4 py-3 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedCategory}
                  <span>
                    <IoIosArrowDown />
                  </span>
                </button>

                {isCategoryOpen && (
                  <div
                    ref={categoryRef}
                    className="absolute z-10 w-full max-h-[170px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {categoryOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleCategorySelect(option)}
                        className="p-2 cursor-pointer"
                      >
                        <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                          {option.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-[15px] w-full">
                <p>Year</p>
                <input
                  type="text"
                  className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                  placeholder="Batch year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>

            <div className="flex xsm:flex-row flex-col gap-3 mx-auto w-full justify-between">
              {/* Start Date Input */}
              <div className="space-y-2 text-[15px] w-full">
                <p>Start Date</p>
                <div className="relative w-full">
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDate}
                    className="border border-dark-300 text-[#424b55] outline-none p-3 rounded-lg w-full"
                    placeholder="Select start date"
                  />
                  {/* <FaCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 pointer-events-none" /> */}
                </div>
              </div>

              {/* End Date Input */}
              <div className="space-y-2 text-[15px] w-full">
                <p>End Date</p>
                <div className="relative w-full">
                  <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="border border-dark-300 text-[#424b55] outline-none p-3 rounded-lg w-full"
                    placeholder="Select end date"
                  />
                  {/* <FaCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 pointer-events-none" /> */}
                </div>
                {errorMessage && (
                  <p className="text-[#D84848] text-[12px] mt-2">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mx-auto w-full justify-between"></div>
            <div className="flex w-full justify-center items-center">
              <button
                type="submit"
                onClick={handleBatchCreation}
                className="w-fit flex justify-center py-3 px-12 text-sm font-medium rounded-lg text-dark-100 bg-[#03A1D8] hover:bg-[#2799bf] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchModal;
