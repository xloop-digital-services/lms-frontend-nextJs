import { assignSessionToInstructor, assignSessiontoStudent, listAllSessions } from "@/api/route";
import useClickOutside from "@/providers/useClickOutside";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { BsArrowUpRightSquare } from "react-icons/bs";
import { toast } from "react-toastify";
import loadCustomRoutes from "next/dist/lib/load-custom-routes";

const ApprovalUserModal = ({
  selectedOption,
  setModal,
  modal,
  firstName,
  lastName,
  dob,
  city,
  email,
  contact,
  status,
  locations,
  programs,
  skills,
  id,
  loading,
}) => {
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionIds, setSessionIds] = useState([]); // Corrected spelling
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(false); // Corrected variable name
  const [loadingAssign, setLoadingAssign] = useState(false)
  const click = useRef(null);

  useClickOutside(click, () => setShowDropdown(false));

  const handleGetSessions = async () => {
    setLoadingSessions(true);
    try {
      const response = await listAllSessions();
      setLoadingSessions(false);
      console.log("sessions", response.data);
      setSessions(response.data);
    } catch (error) {
      console.log("Error while fetching the sessions", error);
      setLoadingSessions(false);
    }
  };

  useEffect(()=> {
    handleGetSessions()
    setSelected(false)
  },[])

  const handleToggle = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleSelectSession = (session) => {
    setSessionIds((prevSelected) => {
      if (prevSelected.includes(session.id)) {
        // If the session is already selected, remove it
        return prevSelected.filter((id) => id !== session.id);
      } else {
        // Otherwise, add the session ID to the array
        return [...prevSelected, session.id];
      }
    });
    setSelected(true); // Set selected to true if at least one session is selected
  };

  const handleSessionAssign = async () => {
    setLoadingAssign(true)
    const data = {
      user_id: id,
      session_ids: sessionIds, // Corrected spelling
    };
    try {
      if(selectedOption === 'student'){
        const response = await assignSessiontoStudent(data);
        toast.success(response.data.message)
        console.log("session response for student", response);
        setLoadingAssign(false)
        
      } else {
        const response = await assignSessionToInstructor(data)
        toast.success(response.data.message)
        console.log("session response for student", response);
        setLoadingAssign(false)
      }
    } catch (error) {
      console.log('Error in assigning', error); // Corrected spelling
      setLoadingAssign(false)
    }
  };

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
          <div
            className="bg-surface-100 p-6 rounded-xl flex flex-col justify-start space-y-5"
          >
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
            <div className="px-[30px] text-base flex gap-4 items-center">
              <div>
                <button
                  onClick={handleToggle}
                  className="border border-dark-300 px-4 py-2 rounded-xl hover:bg-dark-100"
                >
                  Select Sessions
                </button>
                {/* Dropdown logic */}
                {showDropdown && (
                  <div ref={click} className="absolute mt-2 p-2 border border-dark-300 bg-[#ffff] rounded-xl shadow bg-white z-20">
                    {loadingSessions ? (
                      <CircularProgress size={20} />
                    ) : (
                      <ul className="list-none p-0 m-0">
                        {sessions.map((session) => (
                          <li
                            key={session.id}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                              sessionIds.includes(session.id)
                                ? "bg-blue-100" // Highlight selected sessions
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
                  <button onClick={handleSessionAssign}><BsArrowUpRightSquare size={33} className="text-dark-300 hover:text-dark-400" /> </button>
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
