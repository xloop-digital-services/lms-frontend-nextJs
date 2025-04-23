import React, { useEffect, useRef, useState } from "react";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { createSession, getAllCourses, UpdateSession } from "@/api/route";
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
  setEdit,
  edit,
  session,
  selectedSession,
}) => {
  const [selectedLocation, setSelectedLocation] = useState("Select location");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState("Select batch");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isBatchSelected, setIsBatchSelected] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [capacity, setCapacity] = useState(null);
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
  const [hoveredDay, setHoveredDay] = useState(null);
  const [editableDays, setEditableDays] = useState({});
  const [previousSelectedDays, setPreviousSelectedDays] = useState([]);
  const [timeData, setTimeData] = useState({
    0: { startTime: "", endTime: "" },
    1: { startTime: "", endTime: "" },
    2: { startTime: "", endTime: "" },
    3: { startTime: "", endTime: "" },
    4: { startTime: "", endTime: "" },
    5: { startTime: "", endTime: "" },
    6: { startTime: "", endTime: "" },
  });
  const [startDate, setstartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [error, setError] = useState(""); // To track error messages
  const locationDown = useRef(null);
  const locationButton = useRef(null);
  const batchDown = useRef(null);
  const batchButton = useRef(null);
  const courseDown = useRef(null);
  const courseButton = useRef(null);
  const modalClose = useRef(null);

  const WEEKDAYS = {
    0: ["Monday", "Mon"],
    1: ["Tuesday", "Tue"],
    2: ["Wednesday", "Wed"],
    3: ["Thursday", "Thu"],
    4: ["Friday", "Fri"],
    5: ["Saturday", "Sat"],
    6: ["Sunday", "Sun"],
  };

  // console.log(session, "session for update");

  useClickOutside(locationDown, locationButton, () => {
    setIsLocationOpen(false);
  });

  useClickOutside(batchDown, batchButton, () => {
    setIsBatchOpen(false);
  });

  useClickOutside(courseDown, courseButton, () => {
    setIsCourseOpen(false);
  });

  useClickOutside(modalClose, () => {
    setOpenModal(false);
    setEdit(false);
  });

  useEffect(() => {
    if (session && edit) {
      setSelectedBatch(session.batch);
      setSelectedCourseName(session.course.name);
      setSelectedCourseId(session.course.id);
      setSelectedLocation(session.location_name);
      setSelectedLocationId(session.location);
      setCapacity(session.no_of_students);
      setstartDate(session.start_date);
      setendDate(session.end_date);
      setIsLocationSelected(true);

      const daysArray = session.schedules.map((schedule) => {
        const dayIndex = Object.keys(WEEKDAYS).find(
          (key) => WEEKDAYS[key][0] === schedule.day_of_week
        );
        return parseInt(dayIndex);
      });
      setSelectedDays(daysArray); // Set the selected days in state

      // Populate timeData based on schedules
      const updatedTimeData = { ...timeData };
      session.schedules.forEach((schedule) => {
        const dayIndex = Object.keys(WEEKDAYS).find(
          (key) => WEEKDAYS[key][0] === schedule.day_of_week
        );
        if (dayIndex) {
          updatedTimeData[dayIndex] = {
            startTime: schedule.start_time,
            endTime: schedule.end_time,
          };
        }
      });
      setTimeData(updatedTimeData); // Set the time data in state
    }
  }, [session, edit]);

  const handleUpdate = async () => {
    if (selectedDays.length > 0) {
      // Check for time null condition
      const hasNullTime = selectedDays.some((day) => {
        const time = timeData[day];
        return !time || !time.startTime || !time.endTime; // Check if timeData is null or start/end times are null
      });

      if (hasNullTime) {
        toast.error("Please select time for all selected days."); // Display error toast
        setLoadingCreation(false);
        return; // Stop further execution
      }
    }

    if (timeErrorMessage) {
      toast.error(timeErrorMessage);
    } else if (dateErrorMessage) {
      toast.error(dateErrorMessage);
    } else {
      setLoadingCreation(true);
      try {
        const data = {
          location: selectedLocationId,
          no_of_students: capacity,
          start_date: startDate,
          end_date: endDate,
          course_id: selectedCourseId,
          schedules: selectedDays.map((day) => ({
            day_of_week: WEEKDAYS[day][0], // Full name of the day
            start_time: timeData[day].startTime, // Fetch start time for the day
            end_time: timeData[day].endTime,
          })),
        };

        const response = await UpdateSession(selectedSession, data);
        // console.log("session updated", response);
        setEdit(false);
        toast.success("Class schedule updated successfully");
        setUpdateSession(!updateSession);
      } catch (error) {
        // console.log("error while updating status", error);
      } finally {
        setLoadingCreation(false); // Set updating to false after the update is complete
      }
    }
  };

  const handleSessionCreation = async () => {
    setLoadingCreation(true);
    if (error) {
      toast.error("Capacity must be a positive value"); // Display the error toast
      setLoadingCreation(false); // Set loading to false
      return; // Stop further execution
    }

    if (selectedDays.length > 0) {
      // Check for time null condition
      const hasNullTime = selectedDays.some((day) => {
        const time = timeData[day];
        return !time || !time.startTime || !time.endTime; // Check if timeData is null or start/end times are null
      });

      if (hasNullTime) {
        toast.error("Please select time for all selected days."); // Display error toast
        setLoadingCreation(false);
        return; // Stop further execution
      }
    }

    if (!timeErrorMessage && !dateErrorMessage) {
      if (
        selectedLocation &&
        selectedBatch &&
        startDate &&
        endDate &&
        selectedCourseName &&
        capacity &&
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
            course_id: selectedCourseId,
            schedules: selectedDays.map((day) => ({
              day_of_week: WEEKDAYS[day][0], // Full name of the day
              start_time: timeData[day].startTime, // Fetch start time for the day
              end_time: timeData[day].endTime, // Fetch end time for the day
            })),
          };

          const response = await createSession(data);
          // console.log("session created", response.data.message);
          toast.success(response.data.message);
          setLoadingCreation(false);
          setOpenModal(false);
          setUpdateSession(!updateSession);
        } catch (error) {
          // console.log("error while session creation", error);
          if (error.response && error.response.status === 400) {
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
        // console.log("courses", response?.data?.data);

        // Create an array of course names
        const namesArray = response?.data?.data.map((course) => course.name);
        // console.log("names of courses", namesArray);

        // Create a map of course names to full course objects
        const coursesObject = response?.data?.data.reduce((acc, course) => {
          acc[course.name] = course; // Map course name to its full object
          return acc;
        }, {});

        setCourseNames(response?.data?.data); // Set course names array
        setCoursesMap(coursesObject); // Set courses map
        setLoadingCourses(false);
      } catch (error) {
        // console.log("error in courses list", error);
        setLoadingCourses(false);
      }
    };

    handleCoursesList();
  }, []);

  const handleStartDate = (event) => {
    setstartDate(event.target.value);
    // }
  };

  const handleEndDateChange = (event) => {
    setendDate(event.target.value);

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
    date.setSeconds(0);
    return date;
  };

  const handleStartTimeChange = (event) => {
    const time = event.target.value;
    setStartTime(time);
    // console.log("Start time:", time);

    // Validate again when the start time changes, to reset any lingering errors
    if (endTime && time) {
      const startTimeDate = convertTimeToDate(time);
      const endTimeDate = convertTimeToDate(endTime);
      if (endTimeDate <= startTimeDate) {
        setTimeErrorMessage("End time should be greater than start time");
      } else {
        setTimeErrorMessage("");
      }
    }
  };

  const handleEndTimeChange = (event) => {
    const time = event.target.value;
    setEndTime(time);
    // console.log("End time:", time);

    if (startTime) {
      const startTimeDate = convertTimeToDate(startTime);
      const endTimeDate = convertTimeToDate(time);

      // Validate that end time is greater than start time
      if (endTimeDate <= startTimeDate) {
        setTimeErrorMessage("End time should be greater than start time");
      } else {
        setTimeErrorMessage("");
      }
    } else {
      setTimeErrorMessage("");
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
    setIsCourseSelected(true);
    setIsCourseOpen(false);
  };

  const handleCheckboxChange = (e) => {
    const day = parseInt(e.target.value, 10);
  
    setSelectedDays((prevSelectedDays) => {
      const isSelected = prevSelectedDays.includes(day);
  
      if (isSelected) {
        // If the day is already selected, remove it
        return prevSelectedDays.filter((d) => d !== day);
      } else {
        // If the day is newly selected
        return [...prevSelectedDays, day];
      }
    });
  
    setTimeData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        errorMessage: "", // Clear any error message
      },
    }));
  };
  

  const handleTimeChange = (day, timeType, value) => {
    setTimeData((prev) => {
      // Update the time for the specific day
      const updatedDay = {
        ...prev[day],
        [timeType]: value,
      };

      const startTime = updatedDay.startTime || ""; // Default to an empty string if not set
      const endTime = updatedDay.endTime || "";

      // Validate the times for this specific day
      let timeErrorMessage = "";
      if (startTime && endTime) {
        const startTimeDate = convertTimeToDate(startTime);
        const endTimeDate = convertTimeToDate(endTime);
        if (endTimeDate <= startTimeDate) {
          timeErrorMessage = "End time should be greater than start time";
        }
      }

      // Update all selected days with the same time
      const newTimeData = { ...prev };
      selectedDays.forEach((selectedDay) => {
        if (editableDays[selectedDay]) {
          // Only update days marked as editable
          newTimeData[selectedDay] = {
            ...newTimeData[selectedDay],
            [timeType]: value,
            errorMessage: timeErrorMessage, // Apply the error message only to the editable day
          };
        } else {
          newTimeData[selectedDay] = {
            ...newTimeData[selectedDay],
            [timeType]: value,
            errorMessage: timeErrorMessage, 
          };
        }
      });

      return newTimeData;
    });
  };

  const handleEditTime = (dayKey) => {
    // Store the previously selected days
    setPreviousSelectedDays(selectedDays);
    // Uncheck all days except the one being edited
    setSelectedDays([parseInt(dayKey, 10)]);
    setEditableDays((prev) => ({ ...prev, [dayKey]: true }));
  };
  
  const handleSaveEdit = (dayKey) => {
    setEditableDays((prev) => ({ ...prev, [dayKey]: false }));
    // Recheck previously selected days
    setSelectedDays(previousSelectedDays);
  };
  
  const handleCancelEdit = (dayKey) => {
    setEditableDays((prev) => ({ ...prev, [dayKey]: false }));
    // Recheck previously selected days
    setSelectedDays(previousSelectedDays);
  };

  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className=" w-[600px] z-[1000] mx-auto my-20 overflow-auto scrollbar-webkit">
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
              Schedule a new class
            </h1>
            <button
              className="px-2"
              onClick={() => {
                setOpenModal(false);
                setEdit(false);
              }}
            >
              <IoClose size={21} />
            </button>
          </div>
          <div className="bg-surface-100 xsm:p-6 px-3 py-4 rounded-xl xsm:space-y-5 space-y-2 font-inter max-h-[650px] overflow-auto scrollbar-webkit">
            <div className="flex xsm:flex-row flex-col gap-3 mx-auto w-full justify-between">
              <div className="relative space-y-2 text-[15px] w-full">
                <p>Batch</p>
                <button
                  ref={batchButton}
                  onClick={toggleBatchOpen}
                  className={`${
                    !isBatchSelected || edit
                      ? " text-[#92A7BE]"
                      : "text-[#424b55]"
                  } flex justify-between items-center w-full px-4 py-3 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                  disabled={edit}
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
                    ref={batchDown}
                    className="absolute z-10 w-full max-h-[170px] mt-1 bg-surface-100  overflow-auto scrollbar-webkit border border-dark-300 rounded-lg shadow-lg transition-opaLocation duration-300 ease-in-out"
                  >
                    {loadingBatch && batchOptions.length == 0 ? (
                      <div className="w-full flex items-center justify-center p-1">
                        <CircularProgress size={15} />
                      </div>
                    ) : batchOptions && batchOptions.length > 0 ? (
                      batchOptions
                        .sort(
                          (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at)
                        )
                        .map((option, index) => (
                          <div
                            key={index}
                            onClick={() => handleBatchSelect(option.batch)}
                            className="p-2 cursor-pointer "
                          >
                            <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                              {option.batch}
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
              </div>
              <div className="relative space-y-2 text-[15px] w-full">
                <p>Course</p>
                <button
                  ref={courseButton}
                  onClick={toggleCourseOpen}
                  className={`${
                    !isCourseSelected || edit
                      ? "text-[#92A7BE]"
                      : "text-[#424b55]"
                  } flex justify-between items-center w-full px-4 py-3 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                  style={{
                    // maxWidth: "220px", // Set the maximum width of the button
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  disabled={edit}
                >
                  <p className="max-w-[180px] truncate">
                    {selectedCourseName
                      ? selectedCourseName
                      : "Select a course"}
                  </p>
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
                    ref={courseDown}
                    className="absolute z-10 w-full mt-1 bg-surface-100 max-h-[200px] overflow-auto scrollbar-webkit border border-dark-300 rounded-lg shadow-lg transition-opaLocation duration-300 ease-in-out"
                  >
                    {loadingCourses && courseNames.length === 0 ? (
                      <div className="w-full flex items-center justify-center p-1">
                        <CircularProgress size={15} />
                      </div>
                    ) : courseNames && courseNames.length > 0 ? (
                      courseNames.map((name, index) => (
                        <div
                          key={index}
                          onClick={() => handleCourseSelect(name)}
                          className="py-1 px-2  cursor-pointer"
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
              <div className="relative space-y-2 text-[15px] w-full">
                <p>Location</p>
                <button
                  ref={locationButton}
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
                    ref={locationDown}
                    className="absolute z-10 w-full max-h-[170px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opaLocation duration-300 ease-in-out"
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
            <div className="flex flex-col gap-3 mx-auto mt-1 w-full">
              <div className="space-y-2 text-[15px] w-full">
                <div className="flex justify-between w-[90%]">
                  <p>Week Days</p>
                  <div className="flex gap-[56px]">
                    <p>Start Time</p>
                    <p>End Time</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {/* Individual checkboxes for each day */}
                  {Object.entries(WEEKDAYS).map(([key, [fullName]]) => (
                    <div
                      key={key}
                      className={`flex items-start justify-between gap-2 ${
                        selectedDays.includes(parseInt(key, 10))
                          ? "text-[#424b55]"
                          : "text-[#92A7BE]"
                      }`}
                      onMouseEnter={() => setHoveredDay(key)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      <label className="flex w-[30%] mt-3">
                        <input
                          type="checkbox"
                          value={key}
                          onChange={handleCheckboxChange}
                          checked={selectedDays.includes(parseInt(key, 10))}
                          className="mr-2"
                        />
                        {fullName}
                      </label>
                      <div className="flex flex-col items-center w-full relative">
                        <div className="flex xsm:flex-row flex-col gap-2 mx-auto w-full justify-between">
                          <div className="relative w-full ">
                            {!editableDays[key] ? (
                              <button
                                className={`absolute inset-0  ${
                                  hoveredDay === key &&
                                  selectedDays.includes(parseInt(key, 10)) &&
                                  timeData[key]?.startTime &&
                                  timeData[key]?.endTime
                                    ? "block"
                                    : "hidden"
                                } text-[11px] text-dark-400 hover:text-blue-300 text-end px-2 py-1 rounded-lg`}
                                onClick={() => handleEditTime(key)}
                              >
                                Change time
                              </button>
                            ) : (
                              <div className="absolute inset-0 flex gap-3 items-center justify-end px-2">
                                <IoClose
                                  className="hover:cursor-pointer hover:text-dark-400"
                                  title="Cancel"
                                  onClick={() => handleCancelEdit(key)}
                                />
                                <IoCheckmark
                                  className="hover:cursor-pointer hover:text-blue-300"
                                  title="Save"
                                  onClick={() => handleSaveEdit(key)}
                                />
                              </div>
                            )}
                          </div>
                          {/* Start Time Input */}
                          <div className="space-y-2 text-[15px] w-full">
                            <div className="relative">
                              <input
                                type="time"
                                value={timeData[key]?.startTime || ""}
                                onChange={(e) =>
                                  handleTimeChange(
                                    key,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                                className="border border-dark-300 text-[#424b55] outline-none p-2 rounded-lg w-full"
                                placeholder="Select start time"
                                disabled={
                                  !selectedDays.includes(parseInt(key, 10)) &&
                                  !editableDays[key]
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2 text-[15px] w-full">
                            <div className="relative">
                              <input
                                type="time"
                                value={timeData[key]?.endTime || ""}
                                onChange={(e) =>
                                  handleTimeChange(
                                    key,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                                className="border border-dark-300 text-[#424b55] outline-none p-2 rounded-lg w-full"
                                placeholder="Select end time"
                                disabled={
                                  !selectedDays.includes(parseInt(key, 10)) &&
                                  !editableDays[key]
                                }
                              />
                            </div>
                          </div>
                        </div>
                        {/* Error Message */}
                        {timeData[key]?.errorMessage && (
                          <p className="text-mix-200 text-[12px] mt-2">
                            {timeData[key]?.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center w-full mt-2">
                <button
                  type="submit"
                  onClick={!edit ? handleSessionCreation : handleUpdate}
                  className="w-fit flex justify-center py-3 px-12 text-sm font-medium rounded-lg text-dark-100 bg-blue-300 hover:bg-[#3272b6] focus:outline-none"
                >
                  {!edit ? `Schedule` : "Update"}
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