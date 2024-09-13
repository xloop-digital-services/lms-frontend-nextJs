import React, { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { BsArrowUpRightSquare } from "react-icons/bs";
import { toast } from "react-toastify";
import useClickOutside from "@/providers/useClickOutside";
import {
  assignSessionToInstructor,
  assignSessiontoStudent,
  getInstructorSessions,
  listAllSessions,
} from "@/api/route";
import { IoIosArrowDown } from "react-icons/io";

const ApprovalUserModal = ({
  selectedOption,
  setModal,
  firstName,
  lastName,
  email,
  locations,
  programs,
  skills,
  status,
  id,
}) => {
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionIds, setSessionIds] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(false);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [assignedSessions, setAssignedSessions] = useState([]);
  const [updateSession, setUpdateSessions] = useState(0);
  const [selectedSessionCourse, setSelectedSessionCourse] = useState(null);
  const [selectedSessionLocation, setSelectedSessionLocation] = useState(null);
  const [selectedSessionEndtime, setSelectedSessionEndTime] = useState(null);
  const [selectedSessionStartTime, setSelectedSessionStartTime] =
    useState(null);
  const [selectedSessionCapacity, setSelectedSessionCapacity] = useState(null);
  const [selectedSessionStatus, setSelectedSessionStatus] = useState(null);
  const [isSessionSelected, setIsSessionSelected] = useState(null);
  const [loadingSelection, setLoadingSelection] = useState(false);
  const click = useRef(null);

  useClickOutside(click, () => setShowDropdown(false));

  const handleGetSessions = async () => {
    setLoadingSessions(true);
    try {
      const response = await listAllSessions();
      setLoadingSessions(false);
      setSessions(response.data);
    } catch (error) {
      console.log("Error while fetching the sessions", error);
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    handleGetSessions();
    setSelected(false);
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleSelectSession = (session) => {
    setSessionIds((prevSelected) => {
      if (prevSelected.includes(session.id)) {
        return prevSelected.filter((id) => id !== session.id);
      } else {
        return [...prevSelected, session.id];
      }
    });
    setSelected(true);
  };

  const handleSessionAssign = async () => {
    setLoadingAssign(true);
    const data = {
      user_id: id,
      session_ids: sessionIds,
    };
    try {
      const response =
        selectedOption === "student"
          ? await assignSessiontoStudent(data)
          : await assignSessionToInstructor(data);

      toast.success(response.data.message);
      setUpdateSessions(updateSession + 1);
      setLoadingAssign(false);
    } catch (error) {
      console.log("Error in assigning", error);
      if (error.response.status === 401) {
        toast.error("your log in token has been expired. Please log in again!");
      }
      setLoadingAssign(false);
    }
  };

  const handleUserSessions = async () => {
    setLoadingSelection(true);
    try {
      const response = await getInstructorSessions(id, selectedOption);
      setAssignedSessions(response?.data?.data);
      setLoadingSelection(false);
    } catch (error) {
      console.log("error", error);
      setLoadingSelection(false);
    }
  };

  useEffect(() => {
    handleUserSessions();
  }, [id, selectedOption, updateSession]);

  useEffect(() => {
    if (assignedSessions.length > 0) {
      handleSessionInfo(assignedSessions[0]);
    }
  }, [assignedSessions]);

  const handleSessionInfo = (session) => {
    setSelectedSessionCourse(session.course);
    setSelectedSessionLocation(session.location);
    setSelectedSessionEndTime(session.end_time);
    setSelectedSessionStartTime(session.start_time);
    setSelectedSessionCapacity(session.no_of_students);
    if (session.status === 1) {
      setSelectedSessionStatus("Active");
    } else {
      setSelectedSessionStatus("Inactive");
    }
    setIsSessionSelected(session);
  };

  return (
    <div className="backDropOverlay min-h-screen flex items-center">
      <div className="min-w-[70%] z-[1000] mx-auto my-20 relative">
        {loadingAssign && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
            <CircularProgress size={30} />
          </div>
        )}
        <div
          style={{ backgroundColor: "#EBF6FF" }}
          className="p-5 rounded-xl h-full"
        >
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#07224D",
              }}
              className="text-start px-2 py-[10px]"
            >
              User Information
            </h1>
            <button className="px-2" onClick={() => setModal(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div className="bg-surface-100 p-6 rounded-xl flex flex-col justify-start space-y-5">
            <div>
              <h1 className="text-2xl text-center">
                {firstName} {lastName}
              </h1>
              <p className="text-sm text-dark-400 text-center">{email}</p>
            </div>
            <div className="absolute top-[60px] right-[50px]">
              <p className="text-sm text-dark-400 text-center">Status</p>
              <div className="py-2 whitespace-nowrap flex w-full justify-start text-sm text-surface-100 dark:text-gray-200">
                <p
                  className={`${
                    status === "pending"
                      ? "bg-[#DDF8EE] text-blue-300 border border-blue-300"
                      : "bg-[#18A07A]"
                  } w-[120px] text-center px-4 py-2 rounded-lg capitalize`}
                >
                  {status}
                </p>
              </div>
            </div>
            <div className="w-full h-[2px] bg-dark-200"></div>
            {loadingSelection ? (
              <div className="h-full w-full flex justify-center items-center">
                <CircularProgress />
              </div>
            ) : (
              <div className="px-[30px] text-base flex gap-4 h-full w-full justify-evenly">
                {assignedSessions && assignedSessions.length > 0 && (
                  <div className="">
                    <h2 className=" border-b border-dark-300 py-1 mb-2 text-sm text-dark-400">
                      Assigned Sessions:
                    </h2>
                    <ul className="list-disc space-y-2">
                      {assignedSessions.map((session, index) => (
                        <li
                          key={index}
                          onClick={() => handleSessionInfo(session)}
                          className={`${
                            isSessionSelected === session && "text-blue-300"
                          }`}
                        >
                          {session.location} {session.course}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="w-[1.5px] h-[150px] bg-dark-200 rounded-lg"></div>
                <div className="w-[50%]">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-[#d7e4ee]">
                        <td className="text-dark-400 text-center py-2">
                          Location
                        </td>
                        <td className="text-center py-2">
                          {selectedSessionLocation || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-[#d7e4ee]">
                        <td className="text-dark-400 text-center py-2">
                          Course
                        </td>
                        <td className="text-center py-2">
                          {selectedSessionCourse || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-[#d7e4ee]">
                        <td className="text-dark-400 text-center py-2">
                          Capacity
                        </td>
                        <td className="text-center py-2">
                          {selectedSessionCapacity || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-[#d7e4ee]">
                        <td className="text-dark-400 text-center py-2">
                          Start Time
                        </td>
                        <td className="text-center py-2">
                          {selectedSessionStartTime || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-[#d7e4ee]">
                        <td className="text-dark-400 text-center py-2">
                          End Time
                        </td>
                        <td className="text-center py-2">
                          {selectedSessionEndtime || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-[#d7e4ee]">
                        <td className="text-dark-400 text-center py-2">
                          Status
                        </td>
                        <td className="text-center py-2">
                          {selectedSessionStatus || "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4  items-center w-full">
            <div className="flex flex-col justify-end  pt-5 pb-4 relative min-w-[200px]">
              {/* <div>
                <p className=" text-xs">Assign sessions</p>
              </div> */}
              <div className="relative bg-surface-100 rounded-xl">
                <button
                  className="flex  items-center justify-between border-dark-100 border-2 text-dark-400 text-center p-2  w-full "
                  onClick={handleToggle}
                >
                  <span>assign sessions</span>
                  <span className="flex items-center">
                    <IoIosArrowDown
                      size={12}
                      style={{ marginLeft: "8px", fontWeight: "800" }}
                    />
                  </span>
                </button>
                {showDropdown && (
                  <div
                    ref={click}
                    className="absolute z-10 min-w-[220px] max-h-[170px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    <div className="py-2">
                      {loadingSessions ? (
                        <div className="flex justify-center items-center">
                          <CircularProgress size={24} />
                        </div>
                      ) : sessions.length > 0 ? (
                        sessions.map((session, index) => {
                          const isSelected = sessionIds.includes(session.id);
                          const isAssigned = assignedSessions.includes((assigned) => assigned.id === session.id)

                          return (
                            <div
                              key={session.id}
                              onClick={() => handleSelectSession(session)}
                              className={`py-2 px-4 cursor-pointer m-2 rounded-md
                    ${isSelected ? "bg-blue-100 text-blue-800" : "bg-[#ffff]"}
                    hover:bg-dark-200 transition-colors duration-200 ease-in-out`}
                            >
                              {session.location_name} - {session.course.name}
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-2 px-4 text-center text-sm text-gray-400">
                          No sessions available
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex w-full py-2 px-6 justify-end">
              <button
                className={`bg-blue-300 ${
                  selected ? "" : "opacity-30"
                } text-surface-100 py-2 w-[120px] text-sm h-fit rounded-md flex justify-center items-center`}
                onClick={handleSessionAssign}
                // disabled={!selected}
              >
                Save
                <span className="flex items-center">
                  <BsArrowUpRightSquare
                    style={{ fontSize: "15px", marginLeft: "8px" }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalUserModal;
