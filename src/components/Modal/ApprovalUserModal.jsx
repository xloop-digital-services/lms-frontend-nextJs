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
  const [updateSession, setUpdateSessions]  = useState(0)
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
    // setAssignedSessions(
    //   sessions.filter((session) => sessionIds.includes(session.id))
    // );
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
      setUpdateSessions(updateSession+1)
      // Update assigned sessions state
      // setModal(false);
      setLoadingAssign(false);
    } catch (error) {
      console.log("Error in assigning", error);
      setLoadingAssign(false);
    }
  };

  const handleUserSessions = async () => {
    try {
      const response = await getInstructorSessions(id, selectedOption);
      console.log("response", response.data);
      setAssignedSessions(response?.data?.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleUserSessions();
  }, [id, selectedOption, updateSession]);

  return (
    <div className="backDropOverlay min-h-screen flex items-center">
      <div className="min-w-[70%] z-[1000] mx-auto my-20 relative">
        {loadingAssign && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
            <CircularProgress size={30} />
          </div>
        )}
        <div style={{ backgroundColor: "#EBF6FF" }} className="p-5 rounded-xl">
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
            <div className="px-[30px] text-base flex gap-4 items-start justify-evenly">
              <div className="flex flex-col gap-4">
                {locations && (
                  <div className="space-y-2">
                    <p className="border-b border-dark-300 py-1 text-sm text-dark-400">
                      Selected Locations
                    </p>
                    <p>{locations}</p>
                  </div>
                )}
                {selectedOption === "student"
                  ? programs && (
                      <div className="space-y-2">
                        <p className="border-b border-dark-300 py-1 text-sm text-dark-400">
                          Selected Programs
                        </p>
                        <p>{programs}</p>
                      </div>
                    )
                  : skills && (
                      <div className="space-y-2">
                        <p className="border-b border-dark-300 py-1 text-sm text-dark-400">
                          Selected Skills
                        </p>

                        <p>{skills}</p>
                      </div>
                    )}
              </div>
              
              {assignedSessions && assignedSessions.length > 0 && (
                <div className="">
                  <h2 className=" border-b border-dark-300 py-1 text-sm text-dark-400">
                    Assigned Sessions:
                  </h2>
                  <ul>
                    {assignedSessions.map((session, index) => (
                      <li key={index}>
                        {session.location} {session.course}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <button
                  onClick={handleToggle}
                  className=" flex justify-between items-center gap-3 border border-dark-300 px-4 py-2 rounded-lg hover:bg-dark-100"
                >
                  Select Sessions
                  <span><IoIosArrowDown /></span>
                </button>
                {showDropdown && (
                  <div
                    ref={click}
                    className="absolute max-h-[100px] overflow-auto scrollbar-webkit mt-2 p-2 border border-dark-300 bg-[#ffff] rounded-xl shadow z-20"
                  >
                    {loadingSessions ? (
                      <CircularProgress size={20} />
                    ) : (
                      <ul className="list-none p-0 m-0">
                        {sessions.map((session) => (
                          <li
                            key={session.id}
                            className={`px-4 py-2 mb-2 hover:bg-dark-100 cursor-pointer rounded-lg ${
                              sessionIds.includes(session.id)
                                ? "bg-blue-100"
                                : ""
                            }`}
                            onClick={() => handleSelectSession(session)}
                          >
                            {session.location_name} {session.course.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              {selected && (
                <div>
                  <button onClick={handleSessionAssign} type="assign session">
                    <BsArrowUpRightSquare
                      size={33}
                      className="text-dark-300 hover:text-dark-400"
                    />
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalUserModal;
