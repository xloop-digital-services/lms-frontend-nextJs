import { DeleteSession, UpdateBatch, UpdateSession } from "@/api/route";
import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoCheckmark, IoClose, IoCloseCircle } from "react-icons/io5";
import DeleteConfirmationPopup from "./Modal/DeleteConfirmationPopUp";
import { toast } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";
import useClickOutside from "@/providers/useClickOutside";

const SessionsTable = ({
  sessions,
  loading,
  setLoading,
  updateSession,
  setUpdateSession,
  setSelectedSession,
  selectedSession,
  setConfirmDelete,
  confirmDelete,
}) => {
  const [session, setSession] = useState(null);
  const [edit, setEdit] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(null);
  const [editEndTime, setEditEndTime] = useState(null);
  const [editStartTime, setEditStartTime] = useState(null);
  const [editCapacity, setEditCapacity] = useState(null);
  // const [updateSession, setUpdateSession] = useState(false)
  const [toggleWeek, setToggleWeek] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const weekRef = useRef(null);
  const [timeErrorMessage, setTimeErrorMessage] = useState("");
  const [shouldOpenUpward, setShouldOpenUpward] = useState(false); // Determines dropdown direction

  useClickOutside(weekRef, () => setToggleWeek(false));

  const WEEKDAYS = {
    0: ["Monday", "Mon"],
    1: ["Tuesday", "Tue"],
    2: ["Wednesday", "Wed"],
    3: ["Thursday", "Thu"],
    4: ["Friday", "Fri"],
    5: ["Saturday", "Sat"],
    6: ["Sunday", "Sun"],
  };

  const handleToggleWeekdays = (e) => {
    const dropdown = e.target.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const dropdownHeight = 220; // Approximate height of the dropdown

    if (dropdown.bottom + dropdownHeight > windowHeight) {
      setShouldOpenUpward(true); // Open upwards
    } else {
      setShouldOpenUpward(false); // Open downwards
    }

    setToggleWeek(!toggleWeek);
  };

  const handleDaySelect = (day) => {
    setSelectedDays(
      (prevSelected) =>
        prevSelected.includes(parseInt(day))
          ? prevSelected.filter((d) => d !== parseInt(day)) // Deselect the day
          : [...prevSelected, parseInt(day)] // Select the day
    );
  };

  const handleUpdateStatus = (session) => {
    setSelectedSession(session.id);
    setEditCapacity(session.no_of_students);
    setEditEndTime(session.end_time);
    setEditStartTime(session.start_time);
    setStatus(session.status);
    setSelectedDays(session.days_of_week);
    setSession(session);
    setEdit(!edit);
  };

  const handleSetStatus = (status) => {
    console.log(status);
    if (status === "Active") {
      setStatus(1);
    } else {
      setStatus(0);
      console.log("ye zaero hogaya");
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
    setEditStartTime(time);
    console.log("Start time:", time);

    // Validate again when the start time changes, to reset any lingering errors
    if (editEndTime && time) {
      const startTimeDate = convertTimeToDate(time);
      const endTimeDate = convertTimeToDate(editEndTime);
      if (endTimeDate <= startTimeDate) {
        setTimeErrorMessage("End time should be greater than start time");
      } else {
        setTimeErrorMessage(""); // Clear error if times are valid
      }
    }
  };

  const handleEndTimeChange = (event) => {
    const time = event.target.value;
    setEditEndTime(time);
    console.log("End time:", time);

    if (editStartTime) {
      const startTimeDate = convertTimeToDate(editStartTime);
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

  const handleUpdate = async () => {
    if (status === null || updating) return;
    if (editStartTime && editEndTime <= editStartTime) {
      toast.error(timeErrorMessage);
    } else {
      setLoading(true);
      try {
        const data = {
          batch: session.batch,
          course: session.course.id,
          location: session.location,
          no_of_students: editCapacity,
          start_date: session.start_date,
          end_date: session.end_date,
          start_time: editStartTime,
          end_time: editEndTime,
          status: session.status,
          days_of_week: selectedDays,
        };

        const response = await UpdateSession(selectedSession, data);
        console.log("session updated", response);
        setEdit(false);
        toast.success("Class schedule updated successfully");
        setUpdateSession(!updateSession);
      } catch (error) {
        console.log("error while updating status", error);
      } finally {
        setUpdating(false); // Set updating to false after the update is complete
      }
    }
  };

  const handleDeleteSession = (session) => {
    setSelectedSession(session.id);
    setConfirmDelete(true);
  };

  return (
    <>
      <div className="flex flex-col ">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="mt-4 border border-dark-300 rounded-lg divide-y divide-dark-200">
              <div className="relative max-h-[75vh]  overflow-y-auto scrollbar-webkit">
                <table className="min-w-full divide-y divide-dark-200 ">
                  <thead className="bg-surface-100 text-blue-500 sticky top-0 z-50 shadow-sm shadow-dark-200">
                    <tr>
                      {/* <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                    >
                      Batch
                    </th> */}
                      <th
                        scope="col"
                        className="px-6 py-4 rounded-lg text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        Course
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[13%]"
                      >
                        Start Time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[13%]"
                      >
                        End Time
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[14%]"
                      >
                        Remaining Spots
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                      >
                        Days
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 rounded-lg text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-dark-200 ">
                    {loading && sessions.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          <CircularProgress size={20} />
                        </td>
                      </tr>
                    ) : sessions && sessions.length > 0 ? (
                      sessions
                        .sort(
                          (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at)
                        )
                        .map((session, index) => {
                          return (
                            <tr key={index} className={``}>
                              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              {session.batch}
                            </td> */}
                              <td
                                className="px-6 py-4 whitespace-nowrap text-sm max-w-[250px] truncate text-gray-800 dark:text-gray-200"
                                title={session.course.name}
                              >
                                {session.course.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                {session.location_name}
                              </td>

                              {/* <td
                              className={` ${
                                !(edit && selectedSession === session.id)
                                  ? "py-4 px-6"
                                  : "py-1 px-4"
                              } whitespace-nowrap text-sm text-gray-800 dark:text-gray-200`}
                            >
                              {!(edit && selectedSession === session.id) ? (
                                session.no_of_students || "-"
                              ) : (
                                <input
                                  type="number"
                                  value={editCapacity}
                                  onChange={(e) =>
                                    setEditCapacity(e.target.value)
                                  }
                                  className=" px-2 py-2 border border-dark-300 outline-none rounded-lg w-full"
                                  placeholder={session.no_of_students}
                                  min={0}
                                />
                              )}
                            </td> */}
                              <td
                                className={` ${
                                  !(edit && selectedSession === session.id)
                                    ? "py-4 px-6"
                                    : "py-1 px-4"
                                } whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 relative`}
                              >
                                {!(edit && selectedSession === session.id) ? (
                                  session.start_time || "-"
                                ) : (
                                  <input
                                    type="time"
                                    value={editStartTime}
                                    onChange={handleStartTimeChange}
                                    className=" px-2 py-2 border border-dark-300 outline-none  rounded-lg w-full"
                                    placeholder={session.start_time}
                                  />
                                )}
                              </td>
                              <td
                                className={` ${
                                  !(edit && selectedSession === session.id)
                                    ? "py-4 px-6"
                                    : "py-1 px-4"
                                } whitespace-nowrap text-sm text-gray-800 `}
                              >
                                {!(edit && selectedSession === session.id) ? (
                                  session.end_time || "-"
                                ) : (
                                  <input
                                    type="time"
                                    value={editEndTime}
                                    onChange={handleEndTimeChange}
                                    className="border border-dark-300  outline-none  px-2 py-2  rounded-lg w-full"
                                    placeholder={session.end_time}
                                  />
                                )}
                              </td>
                              <td className="py-4 px-6 whitespace-nowrap  text-sm ">
                                {session.remaining_spots}
                              </td>
                              <td
                                className={`${
                                  !(edit && selectedSession === session.id)
                                    ? "py-4 px-6"
                                    : "py-1 px-4"
                                }  whitespace-nowrap text-sm max-w-[170px]`}
                              >
                                {!(edit && selectedSession === session.id) ? (
                                  session.days_of_week &&
                                  session.days_of_week.length > 0 ? (
                                    <div
                                      title={session.days_of_week
                                        .map((day) => WEEKDAYS[day][1])
                                        .join(", ")}
                                        className=" max-w-[170px] truncate"
                                    >
                                      {session.days_of_week.map(
                                        (day, index) => (
                                          <span
                                            key={index}
                                            
                                          >
                                            {WEEKDAYS[day][1]}
                                            {index <
                                              session.days_of_week.length - 1 &&
                                              ", "}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    "-"
                                  )
                                ) : (
                                  <div className="space-y-2 text-[13px] w-full relative z-20">
                                    <button
                                      onClick={(e) => handleToggleWeekdays(e)}
                                      className={`flex justify-between text-[#424b55] items-center w-full hover:text-[#0e1721] px-2 py-2 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                                    >
                                      <div className="flex whitespace-nowrap max-w-[150px] truncate">
                                        {selectedDays.length > 0
                                          ? selectedDays
                                              .map((day) => WEEKDAYS[day][1])
                                              .join(", ")
                                          : "Select days"}
                                      </div>
                                      <span
                                        className={
                                          toggleWeek
                                            ? "rotate-180 duration-300"
                                            : "duration-300"
                                        }
                                      >
                                        <IoIosArrowDown />
                                      </span>
                                    </button>

                                    {toggleWeek && (
                                      <div
                                        ref={weekRef}
                                        className={`absolute z-40 w-full max-h-[170px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out ${
                                          shouldOpenUpward
                                            ? "bottom-full"
                                            : "top-full"
                                        }`}
                                      >
                                        {Object.entries(WEEKDAYS).map(
                                          ([key, [fullName]]) => (
                                            <div
                                              key={key}
                                              onClick={() =>
                                                handleDaySelect(key)
                                              }
                                              className={`m-1 cursor-pointer hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg ${
                                                selectedDays.includes(
                                                  parseInt(key)
                                                )
                                                  ? "bg-blue-100"
                                                  : ""
                                              }`}
                                            >
                                              <p className="px-3 py-2">
                                                {fullName}
                                              </p>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </td>

                              <td className="px-6 py-2 whitespace-nowrap flex w-full justify-start items-center text-sm text-surface-100">
                                <p
                                  className={`
                                     ${
                                       session.status === 1
                                         ? "bg-mix-300"
                                         : "bg-mix-200"
                                     }  w-[100px] text-center py-2 text-[12px] rounded-lg`}
                                >
                                  {/* {!(edit && selectedSession === session.id) ? ( // Check if the current index is selected for editing */}
                                  {(session.status === 1 && "Active") ||
                                    (session.status === 0 && "Inactive")}
                                  {/* ) : (
                                    <th
                                      scope="col"
                                      className=" text-center p-1 text-xs font-medium  text-gray-500 uppercase "
                                    >
                                      <select
                                        className="bg-dark-300 bg-opacity-0 block p-2 w-full  border border-dark-200 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-[#1e785e] transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                        defaultValue={
                                          session.status === 1
                                            ? "Active"
                                            : "Inactive"
                                        }
                                        onChange={(e) =>
                                          handleSetStatus(e.target.value)
                                        } // Handle status change here
                                      >
                                        <option
                                          value="Active"
                                          className="py-2 text-dark-900"
                                        >
                                          Active
                                        </option>
                                        <option
                                          value="Inactive"
                                          className="py-2 text-dark-900"
                                        >
                                          Inactive
                                        </option>
                                      </select>
                                    </th>
                                  )} */}
                                </p>
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap text-blue-300 ">
                                <div className="flex gap-4">
                                  <div>
                                    {!(
                                      edit && selectedSession === session.id
                                    ) ? (
                                      <FaEdit
                                        size={20}
                                        className="cursor-pointer hover:opacity-30"
                                        onClick={() =>
                                          handleUpdateStatus(session)
                                        }
                                        title="update"
                                      />
                                    ) : (
                                      <div className="flex gap-3">
                                        <IoCheckmark
                                          size={20}
                                          title="confirm update"
                                          onClick={handleUpdate}
                                          className="cursor-pointer hover:border-2 border-mix-300 hover:text-mix-300 font-bold rounded-full"
                                        />
                                        <IoClose
                                          size={19}
                                          title="cancel"
                                          onClick={(e) => setEdit(false)}
                                          className="cursor-pointer hover:border-2 border-mix-200 hover:text-mix-200 font-bold rounded-full"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    {!(
                                      edit && selectedSession === session.id
                                    ) && (
                                      <FaTrash
                                        size={20}
                                        className="cursor-pointer hover:opacity-30"
                                        onClick={() =>
                                          handleDeleteSession(session)
                                        }
                                        title="delete"
                                      />
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 whitespace-nowrap text-sm text-dark-400 dark:text-gray-200 text-center"
                        >
                          No sessions available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionsTable;