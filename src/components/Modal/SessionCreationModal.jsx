import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { createSession, getAllCourses } from "@/api/route";
import { CircularProgress } from "@mui/material";
import DatePicker from "react-datepicker";
import { FaClock } from "react-icons/fa";
import { toast } from "react-toastify";
import useClickOutside from "@/providers/useClickOutside";
import moment from "moment";

const SessionCreationModal = ({
  setOpenModal,
  LocationOptions,
  batchOptions,
  loadingLocation,
  loadingBatch,
  setUpdateSession,
  updateSession,
}) => {
  const [selectedLocation, setSelectedLocation] = useState("select Location");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState("select batch");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isBatchSelected, setIsBatchSelected] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [capacity, setCapacity] = useState();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeErrorMessage, setTimeErrorMessage] = useState("");
  const [dateErrorMessage, setDateErrorMessage] = useState("");

  const [loadingCreation, setLoadingCreation] = useState(false);
  const [courseNames, setCourseNames] = useState([]); // Store only the names
  const [coursesMap, setCoursesMap] = useState({}); // Store the mapping of names to full course objects
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedCourseName, setSelectedCourseName] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isCourseSelected, setIsCourseSelected] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startDate, setstartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [error, setError] = useState(""); // To track error messages
  const mouseClick = useRef(null);
  const modalClose = useRef(null);

  useClickOutside(mouseClick, () => {
    setIsLocationOpen(false);
    setIsBatchOpen(false);
    setIsCourseOpen(false);
  });

  useClickOutside(modalClose, () => setOpenModal(false));

  const handleSessionCreation = async () => {
    setLoadingCreation(true);
    if (error) {
      toast.error("Capacity must be a positive value"); // Display the error toast
      setLoadingCreation(false); // Set loading to false
      return; // Stop further execution
    }

    if (!timeErrorMessage && !dateErrorMessage) {
      if (
        selectedLocation &&
        selectedBatch &&
        // selectedBatch &&
        startDate &&
        endDate &&
        selectedCourseName &&
        capacity &&
        startTime &&
        endTime &&
        selectedDays.length > 0
      ) {
        try {
          // Format time to "hh:mm:ss" or "hh:mm:ss.uuuuuu" (24-hour format) before sending to backend
          const data = {
            batch: selectedBatch,
            location: selectedLocationId,
            no_of_students: capacity,
            start_date: startDate,
            end_date: endDate,
            start_time: startTime,
            end_time: endTime,
            course_id: selectedCourseId,
            days_of_week: selectedDays,
          };

          const response = await createSession(data);
          // //console.log("session created", response.data.message);
          toast.success(response.data.message);
          setLoadingCreation(false);
          setOpenModal(false);
          setUpdateSession(!updateSession);
        } catch (error) {
          //console.log("error while session creation", error.response);
          if (error.response.status === 400) {
            toast.error(error.response.data.error[0]);
          }
          // toast.error("error in class scheduling");
          setLoadingCreation(false);
        }
      } else {
        toast.error("All fields are required!");
        setLoadingCreation(false);
      }
    } else {
      toast.error("Correct your time and date");
      setLoadingCreation(false);
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

  useEffect(() => {
    const handleCoursesList = async () => {
      setLoadingCourses(true);
      try {
        const response = await getAllCourses();
        //console.log("courses", response?.data?.data);

        // Create an array of course names
        const namesArray = response?.data?.data.map((course) => course.name);
        // //console.log("names of courses", namesArray);

        // Create a map of course names to full course objects
        const coursesObject = response?.data?.data.reduce((acc, course) => {
          acc[course.name] = course; // Map course name to its full object
          return acc;
        }, {});

        setCourseNames(response?.data?.data); // Set course names array
        setCoursesMap(coursesObject); // Set courses map
        setLoadingCourses(false);
      } catch (error) {
        //console.log("error in courses list", error);
        setLoadingCourses(false);
      }
    };

    handleCoursesList();
  }, []);

  const handleStartDate = (event) => {
    // Check if the date is a valid Date object
    // if (date instanceof Date && !isNaN(date)) {
    //   const formattedDate = date.toISOString().split("T")[0]; // Extract the date part
    //   setstartDate(formattedDate); // Set the start date
    //   // //console.log("start date,", date);
    //   //console.log("formated start date", formattedDate);
    // } else {
    //   toast.error("Invalid date selected");
    setstartDate(event.target.value);
    // }
  };

  const handleEndDateChange = (event) => {
    // if (date instanceof Date && !isNaN(date)) {
    //   const formattedDate = date.toISOString().split("T")[0]; // Extract the date part
    //   setendDate(formattedDate); // Set the end date
    //   // //console.log('end date,', date)
    //   //console.log("formated end date", formattedDate);
    setendDate(event.target.value);
    // Check if end date is earlier than start date
    if (startDate && event.target.value <= startDate) {
      setDateErrorMessage("End date should be greater than start date");
    } else {
      setDateErrorMessage("");
    }
  };

  const convertTimeToDate = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0); // To avoid issues with slight second differences
    return date;
  };

  const handleStartTimeChange = (event) => {
    const time = event.target.value;
    setStartTime(time);
    //console.log("Start time:", time);

    // Validate again when the start time changes, to reset any lingering errors
    if (endTime && time) {
      const startTimeDate = convertTimeToDate(time);
      const endTimeDate = convertTimeToDate(endTime);
      if (endTimeDate <= startTimeDate) {
        setTimeErrorMessage("End time should be greater than start time");
      } else {
        setTimeErrorMessage(""); // Clear error if times are valid
      }
    }
  };

  const handleEndTimeChange = (event) => {
    const time = event.target.value;
    setEndTime(time);
    //console.log("End time:", time);

    if (startTime) {
      const startTimeDate = convertTimeToDate(startTime);
      const endTimeDate = convertTimeToDate(time);

      // Validate that end time is greater than start time
      if (endTimeDate <= startTimeDate) {
        setTimeErrorMessage("End time should be greater than start time");
      } else {
        setTimeErrorMessage(""); // Clear error when valid
      }
    } else {
      setTimeErrorMessage(""); // Clear error if no start time
    }
  };

  const toggleLocationOpen = () => {
    setIsLocationOpen(!isLocationOpen);
  };

  const toggleBatchOpen = () => {
    setIsBatchOpen(!isBatchOpen);
  };

  const toggleCourseOpen = () => {
    setIsCourseOpen(!isCourseOpen);
  };

  const handleLocationSelect = (option) => {
    setSelectedLocation(option.name);
    setSelectedLocationId(option.id);
    setIsLocationOpen(false);
    setIsLocationSelected(true);
  };
  const handleBatchSelect = (option) => {
    setSelectedBatch(option);
    setIsBatchSelected(true);
    setIsBatchOpen(false);
  };
  const handleCourseSelect = (courseName) => {
    setSelectedCourseName(courseName.name);
    setSelectedCourseId(courseName.id);
    // const selectedCourseObject = coursesMap[courseName]; // Get the full course object by name
    // setSelectedCourse(selectedCourseObject);
    setIsCourseSelected(true);
    setIsCourseOpen(false);
  };

  const WEEKDAYS = {
    0: ["Monday", "Mon"],
    1: ["Tuesday", "Tue"],
    2: ["Wednesday", "Wed"],
    3: ["Thursday", "Thu"],
    4: ["Friday", "Fri"],
    5: ["Saturday", "Sat"],
    6: ["Sunday", "Sun"],
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const dayValue = parseInt(value, 10); // Convert the value to an integer

    setSelectedDays((prev) => {
      if (checked) {
        return [...prev, dayValue]; // Add day if checked
      } else {
        return prev.filter((day) => day !== dayValue); // Remove day if unchecked
      }
    });
  };

  const handleSelectAllWeekdays = (e) => {
    const { checked } = e.target;

    if (checked) {
      // Select all weekdays except Sunday (key "6")
      const weekdaysExceptSunday = Object.keys(WEEKDAYS).filter(
        (key) => key !== "6"
      );
      setSelectedDays(weekdaysExceptSunday);
    } else {
      // Uncheck all weekdays except Sunday
      setSelectedDays([]);
    }
  };

  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className=" w-[550px] z-[1000] mx-auto my-20 overflow-auto scrollbar-webkit">
        {loadingCreation && (
          <div className="absolute inset-0 w-full p-2 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
            <CircularProgress size={30} />
          </div>
        )}
        <div
          ref={modalClose}
          style={{ backgroundColor: "#EBF6FF" }}
          className="xsm:p-5 p-2 m-2 rounded-xl"
        >
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#022567",
              }}
              className="text-start  px-2 xsm:py-[10px] pb-[5px] font-exo"
            >
              Scheduling a class
            </h1>
            <button className="px-2" onClick={() => setOpenModal(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div className="bg-surface-100 xsm:p-6 px-3 py-4 rounded-xl xsm:space-y-5 space-y-2 font-inter">
            <div className="flex xsm:flex-row flex-col gap-3 mx-auto w-full justify-between">
              {/* <div className="space-y-2 text-[15px] w-full">
                <p>Batch</p>
                <button
                  onClick={toggleBatchOpen}
                  className={`${
                    !isBatchSelected ? " text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between items-center w-full  hover:text-[#0e1721] px-4 py-3 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedBatch || batchOptions[0]}
                  <span
                    className={`${
                      isBatchOpen ? "rotate-180 duration-300" : "duration-300"
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {isBatchOpen && (
                  <div
                    ref={mouseClick}
                    className="absolute z-10 min-w-[240px] max-h-[170px] mt-1 bg-surface-100  overflow-auto scrollbar-webkit border border-dark-300 rounded-lg shadow-lg transition-opaLocation duration-300 ease-in-out"
                  >
                    {loadingBatch && batchOptions.length == 0 ? (
                      <div className="w-full flex items-center justify-center p-1">
                        <CircularProgress size={15} />
                      </div>
                    ) : batchOptions && batchOptions.length > 0 ? (
                      batchOptions.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleBatchSelect(option)}
                          className="p-2 cursor-pointer "
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                            {option}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-center text-dark-300">
                        no batch found
                      </div>
                    )}
                  </div>
                )}
              </div> */}
              <div className="space-y-2 text-[15px] w-full">
                <p>Course</p>
                <button
                  onClick={toggleCourseOpen}
                  className={`${
                    !isCourseSelected ? "text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between items-center w-full truncate px-4 py-3 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                  style={{
                    // maxWidth: "220px", // Set the maximum width of the button
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {selectedCourseName ? selectedCourseName : "Select a course"}
                  <span
                    className={`${
                      isCourseOpen ? "rotate-180 duration-300" : "duration-300"
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {isCourseOpen && (
                  <div
                    ref={mouseClick}
                    className="absolute z-10 w-[450px] mt-1 bg-surface-100 max-h-[200px] overflow-auto scrollbar-webkit border border-dark-300 rounded-lg shadow-lg transition-opaLocation duration-300 ease-in-out"
                  >
                    {loadingCourses && courseNames.length === 0 ? (
                      <div className="w-full flex items-center justify-center p-1">
                        <CircularProgress size={15} />
                      </div>
                    ) : courseNames && courseNames.length > 0 ? (
                      courseNames.map((name) => (
                        <div
                          key={name}
                          onClick={() => handleCourseSelect(name)}
                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                            {name.name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-center text-dark-300">
                        No course found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex xsm:flex-row flex-col gap-3 mx-auto w-full justify-between">
              <div className="space-y-2 text-[15px] w-full">
                <p>Location</p>
                <button
                  onClick={toggleLocationOpen}
                  className={`${
                    !isLocationSelected ? " text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between items-center w-full  hover:text-[#0e1721] px-4 py-3 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedLocation || LocationOptions[0]}
                  <span
                    className={`${
                      isLocationOpen
                        ? "rotate-180 duration-300"
                        : "duration-300"
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {isLocationOpen && (
                  <div
                    ref={mouseClick}
                    className="absolute z-10 min-w-[240px] max-h-[170px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opaLocation duration-300 ease-in-out"
                  >
                    {loadingLocation ? (
                      <div className="w-full flex items-center justify-center p-1">
                        <CircularProgress size={15} />
                      </div>
                    ) : LocationOptions && LocationOptions.length > 0 ? (
                      LocationOptions.sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at)
                      ).map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleLocationSelect(option)}
                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                            {option.name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-center text-dark-300">
                        no location found
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2 text-[15px] w-full">
                <p>Capacity</p>
                <input
                  type="number"
                  className="border border-dark-300 text-[#424b55] outline-none p-3 rounded-lg w-full "
                  placeholder="Number of students"
                  value={capacity}
                  min={0}
                  onChange={handleInputChange}
                />
                {error && <p className="text-mix-200 text-[12px]">{error}</p>}{" "}
                {/* Display error message */}
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
                {dateErrorMessage && (
                  <p className="text-mix-200 text-[12px] mt-2">
                    {dateErrorMessage}
                  </p>
                )}
              </div>
            </div>
            <div className="flex xsm:flex-row flex-col gap-3 mx-auto w-full justify-between">
              {/* Start Time Input */}
              <div className="space-y-2 text-[15px] w-full">
                <p>Start Time</p>
                <div className="relative">
                  <input
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className="border border-dark-300 text-[#424b55] outline-none p-3 rounded-lg w-full"
                    placeholder="Select start time"
                  />
                </div>
              </div>

              {/* End Time Input */}
              <div className="space-y-2 text-[15px] w-full">
                <p>End Time</p>
                <div className="relative">
                  <input
                    type="time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    className="border border-dark-300 text-[#424b55] outline-none p-3 rounded-lg w-full"
                    placeholder="Select end time"
                  />
                </div>
                {timeErrorMessage && (
                  <p className="text-mix-200 text-[12px] mt-2">
                    {timeErrorMessage}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 mx-auto  w-full">
              <div className="space-y-2 text-[15px] w-full">
                <p>Week Days</p>
                <div className="flex flex-wrap gap-3">
                  {/* Individual checkboxes for each day */}
                  {Object.entries(WEEKDAYS).map(
                    ([key, [fullName, shortName]]) => (
                      <label
                        key={key}
                        className={`flex items-center ${
                          selectedDays.includes(parseInt(key, 10))
                            ? "text-[#424b55]"
                            : "text-[#92A7BE]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={key}
                          onChange={handleCheckboxChange}
                          checked={selectedDays.includes(parseInt(key, 10))}
                          className="mr-2"
                        />
                        {fullName} ({shortName})
                      </label>
                    )
                  )}

                  {/* <label
                    className={`flex items-center ${
                      selectedDays.length === Object.keys(WEEKDAYS).length - 1
                        ? "text-[#424b55]"
                        : "text-[#92A7BE]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      onChange={handleSelectAllWeekdays}
                      checked={
                        selectedDays.length === Object.keys(WEEKDAYS).length - 1
                      } // Check if all weekdays except Sunday are selected
                      className="mr-2"
                    />
                    Select All Weekdays (Mon-Sat)
                  </label> */}
                </div>
              </div>

              <div className="flex items-center justify-center w-full mt-2">
                <button
                  type="submit"
                  onClick={handleSessionCreation}
                  className="w-fit flex justify-center py-3 px-12 text-sm font-medium rounded-lg text-dark-100 bg-blue-300 hover:bg-[#3272b6] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCreationModal;
