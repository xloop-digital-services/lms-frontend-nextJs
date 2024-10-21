import { DeleteSession, UpdateBatch, UpdateSession } from "@/api/route";
import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
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
  setOpenModal,
  setEdit,
  edit,
  session,
  setSession,
}) => {
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
  const [shouldOpenUpward, setShouldOpenUpward] = useState(false);

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
    setEdit(true);
    setSelectedSession(session.id);
    setSession(session);
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

  const handleOpenInfo = (session) => {
    setSelectedSession(session);
    setOpenModal(true);
  };

  return (
    <>
      <div className="flex flex-col ">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="mt-4 border border-dark-300 rounded-lg divide-y divide-dark-200">
              <div className="relative max-h-[75vh]  overflow-y-auto scrollbar-webkit">
                <table className="min-w-full divide-y divide-dark-200 ">
                  <thead className="bg-surface-100 text-blue-500 sticky top-0 z-40 shadow-sm shadow-dark-200">
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
                        className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        Start Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        End Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        Remaining Spots
                      </th>
                      {/* <th
                        scope="col"
                        className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                      >
                        Days
                      </th> */}

                      <th
                        scope="col"
                        className="px-12 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 rounded-lg text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
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
                                className={`whitespace-nowrap py-4 px-6 text-sm text-gray-800 dark:text-gray-200 relative`}
                              >
                                {session.start_date || "-"}
                              </td>
                              <td
                                className={` whitespace-nowrap py-4 px-6 text-sm text-gray-800 `}
                              >
                                {session.end_date || "-"}
                              </td>
                              <td className="py-4 px-6 whitespace-nowrap  text-sm ">
                                {session.remaining_spots}
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
                                  {(session.status === 1 && "Active") ||
                                    (session.status === 0 && "Inactive")}
                                </p>
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap text-blue-300 ">
                                <div className="flex gap-3">
                                  <div>
                                    <FaEye
                                      size={23}
                                      className="cursor-pointer hover:opacity-30"
                                      onClick={() => handleOpenInfo(session)}
                                    />
                                  </div>
                                  <div>
                                    <FaEdit
                                      size={20}
                                      className="cursor-pointer hover:opacity-30"
                                      onClick={() =>
                                        handleUpdateStatus(session)
                                      }
                                      title="update"
                                    />
                                  </div>
                                  <div>
                                    <FaTrash
                                      size={20}
                                      className="cursor-pointer hover:opacity-30"
                                      onClick={() =>
                                        handleDeleteSession(session)
                                      }
                                      title="delete"
                                    />
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
