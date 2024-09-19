import React, { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { BsArrowUpRightSquare } from "react-icons/bs";
import { toast } from "react-toastify";
import useClickOutside from "@/providers/useClickOutside";
import {
  getApplicationUserDetails,
  getCourseByProgId,
  getSuggestedSessionForStudent,
} from "@/api/route";
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
  // const [selectedSessionCapacity, setSelectedSessionCapacity] = useState(null);
  const [selectedSessionStatus, setSelectedSessionStatus] = useState(null);
  const [isSessionSelected, setIsSessionSelected] = useState(null);
  const [loadingSelection, setLoadingSelection] = useState(false);
  const [userPrograms, setUserPrograms] = useState([]);
  const [userProgramId, setUserPorgramId] = useState(null);
  const [userProgramCourses, setUserPorgramCourses] = useState([]);
  const [userLocations, setUserLocations] = useState([]);
  const [userLocationID, setUserLocationID] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [studentSessions, setStudentSessions] = useState([]);

  const WEEKDAYS = {
    0: ["Monday", "Mon"],
    1: ["Tuesday", "Tue"],
    2: ["Wednesday", "Wed"],
    3: ["Thursday", "Thu"],
    4: ["Friday", "Fri"],
    5: ["Saturday", "Sat"],
    6: ["Sunday", "Sun"],
  };

  const click = useRef(null);

  useClickOutside(click, () => setShowDropdown(false));

  useEffect(() => {
    const handleUserDetails = async () => {
      try {
        const response = await getApplicationUserDetails(id, selectedOption);
        console.log("my programs", response?.data?.data);
        setUserPrograms(response?.data?.data?.programs);
        setUserLocations(response?.data?.data.locations);
        setUserSkills(response?.data.data.skills);

        setUserLocationID(
          response?.data?.data.locations.map((location) => location.id)
        );

        setUserPorgramId(
          response?.data?.data?.programs.map((program) => program.id)
        );
      } catch (error) {
        console.log("error fetching user details", error);
      }
    };

    handleUserDetails();
  }, [id, selectedOption]);

  useEffect(() => {
    const handleCoursesByPrograms = async () => {
      try {
        const response = await getCourseByProgId(userProgramId);
        console.log("courses by program", response?.data?.data);
        setUserPorgramCourses(response?.data?.data);
      } catch (error) {
        console.log("error while fetching the courses by program id", error);
      }
    };
    handleCoursesByPrograms();
  }, [userProgramId]);

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

  useEffect(() => {
    const handleGetSuggestedSessions = async () => {
      try {
        const response = await getSuggestedSessionForStudent(
          userProgramId,
          userLocationID
        );
        setStudentSessions(response.data.data.sessions);
        console.log("response of the suggested sessions", response.data);
      } catch (error) {
        console.log("error while fetching suggested sessions", error.response);
      }
    };
    if (selectedOption === "student") {
      handleGetSuggestedSessions();
    }
  }, [userProgramId, userLocationID]);

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
      setSessionIds([])
      setLoadingAssign(false);
    } catch (error) {
      console.log("Error in assigning", error);
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
        
      }
      if (error.response.status === 401) {
        toast.error("your log in token has been expired. Please log in again!");
      }
      setSessionIds([])
      setLoadingAssign(false);
    }
  };

  useEffect(() => {
    const handleUserSessions = async () => {
      setLoadingSelection(true);
      try {
        const response = await getInstructorSessions(id, selectedOption);
        console.log("ye rahe sessions", response?.data?.data);
        setAssignedSessions(response?.data?.data);
        setLoadingSelection(false);
      } catch (error) {
        console.log("error", error);
        if (error.response.data.status_code === 404) {
          setAssignedSessions([]);
        }
        setLoadingSelection(false);
      }
    };
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
    setWeekDays(session.days_of_week);
    if (session.status === 1) {
      setSelectedSessionStatus("Active");
    } else {
      setSelectedSessionStatus("Inactive");
    }
    setIsSessionSelected(session);
  };

  const handleListOfCourses = async () => {
    try {
      // const response = await
    } catch (error) {
      console.log("error while fetching courses", error);
    }
  };

  return (
    <div className="backDropOverlay w-full min-h-screen flex items-center">
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
            <div className="flex justify-evenly items-start pt-2">
              <div className="w-[40%]">
                <h2 className="border-b border-dark-300 py-1 mb-2 text-sm text-dark-400">
                  Locations
                </h2>
                {userLocations && userLocations.length > 0 ? (
                  userLocations.map((location, index) => (
                    <ul
                      key={location.id}
                      className={`${
                        userLocations.length > 1 && "list-disc pl-4"
                      }`}
                    >
                      <li>{location.name}</li>
                    </ul>
                  ))
                ) : (
                  <p className="text-[12px]">No location found</p>
                )}
              </div>
              <div className="w-[40%]">
                {selectedOption === "student" && (
                  <>
                    <h2 className="border-b border-dark-300 py-1 mb-2 text-sm text-dark-400">
                      Programs
                    </h2>
                    {userPrograms && userPrograms.length > 0 ? (
                      userPrograms.map((program) => (
                        <ul key={program.id} className="list-disc pl-4">
                          <li>{program.name}</li>
                          <div>
                            {userProgramCourses &&
                              userProgramCourses.length > 0 &&
                              userProgramCourses.map((course) => (
                                <div key={course.id}>
                                  <p className="px-4"> - {course.name}</p>
                                </div>
                              ))}
                          </div>
                        </ul>
                      ))
                    ) : (
                      <p className="text-[12px]">No programs found</p>
                    )}
                  </>
                )}
                {selectedOption === "instructor" && (
                  <>
                    <div>
                      <h2 className="border-b border-dark-300 py-1 mb-2 text-sm text-dark-400">
                        Skills
                      </h2>
                      {userSkills && userSkills.length > 0 ? (
                        userSkills.map((skill) => (
                          <ul key={skill.id} className="list-disc pl-4">
                            <li>{skill.name}</li>
                          </ul>
                        ))
                      ) : (
                        <p className="text-[12px]">No skills found</p>
                      )}
                    </div>
                    <div></div>
                  </>
                )}
              </div>
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
            <div className="flex gap-4 pl-[50px] justify-start items-center w-full">
              <div className="flex flex-col justify-end  pt-2  relative min-w-[250px]">
                {/* <div>
                <p className=" text-xs">Assign sessions</p>
              </div> */}
                <div className="relative bg-surface-100 rounded-xl">
                  <button
                    className="flex  items-center justify-between border-dark-200 border rounded-lg text-dark-400 text-center p-2  w-full "
                    onClick={handleToggle}
                  >
                    <span>assign classes</span>
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
                      className="absolute z-10 min-w-[200px] mt-1 max-h-[250px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                    >
                      <div className="py-2">
                        {loadingSessions ? (
                          <div className="flex justify-center items-center">
                            <CircularProgress size={24} />
                          </div>
                        ) : selectedOption === "instructor" &&
                          sessions.length > 0 ? (
                          sessions.map((session, index) => {
                            const isSelected = sessionIds.includes(session.id);
                            // const isAssigned = assignedSessions.some(
                            //   (assigned) => assigned.session_id === session.id
                            // );

                            return (
                              <div
                                key={session.id}
                                onClick={() => handleSelectSession(session)}
                                className={`py-2 px-4 cursor-pointer m-2 rounded-md
                             ${
                               isSelected
                                 ? "bg-blue-100 text-blue-800"
                                 : "bg-[#ffff]"
                             }
                    hover:bg-dark-200 transition-colors duration-200 ease-in-out`}
                              >
                                {session.location_name} - {session.course.name}
                              </div>
                            );
                          })
                        ) : studentSessions && studentSessions.length > 0 ? (
                          studentSessions.map((session) => {
                            const isSelected = sessionIds.includes(session.id);
                            return (
                              <div
                                key={session.id}
                                onClick={() => handleSelectSession(session)}
                                className={`py-2 px-4 cursor-pointer m-2 rounded-md
                       ${
                         isSelected ? "bg-blue-100 text-blue-800" : "bg-[#ffff]"
                       }
              hover:bg-dark-200 transition-colors duration-200 ease-in-out`}
                              >
                                {session.location_name} - {session.course.name}
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-2 px-4 text-center text-sm text-dark-300">
                            No sessions available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex  py-2 px-5 justify-end">
                <button
                  className={`bg-blue-300 ${
                    selected ? "" : "opacity-30"
                  } text-surface-100 py-2 w-[100px] text-sm h-fit rounded-md flex justify-center items-center`}
                  onClick={handleSessionAssign}
                  // disabled={!selected}
                >
                  Save
                  {/* <span className="flex items-center">
                  <BsArrowUpRightSquare
                    style={{ fontSize: "15px", marginLeft: "8px" }}
                  />
                </span> */}
                </button>
              </div>
            </div>
            <div className="w-full h-[1px] bg-dark-300"></div>
            {loadingSelection ? (
              <div className="h-full w-full flex justify-center items-center">
                <CircularProgress />
              </div>
            ) : (
              <div className="px-[30px] text-base flex gap-4 h-full w-full justify-evenly">
                {assignedSessions && assignedSessions.length > 0 ? (
                  <>
                    <div>
                      <h2 className="border-b border-dark-300 py-1 mb-2 text-sm text-dark-400">
                        Assigned Sessions:
                      </h2>
                      <ul className="list-disc space-y-2 max-h-[220px] overflow-y-auto w-full scrollbar-webkit ">
                        {assignedSessions.map((session, index) => (
                          <li
                            key={index}
                            onClick={() => handleSessionInfo(session)}
                            className={`cursor-pointer ${
                              isSessionSelected === session
                                ? "text-blue-300"
                                : ""
                            }`}
                          >
                            {session.location} {session.course}
                          </li>
                        ))}
                      </ul>
                    </div>

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
                          {/* <tr className="border-b border-[#d7e4ee]">
                            <td className="text-dark-400 text-center py-2">
                              Capacity
                            </td>
                            <td className="text-center py-2">
                              {selectedSessionCapacity || "-"}
                            </td>
                          </tr> */}
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
                              Days
                            </td>
                            <td className="text-center py-2">
                              {weekDays.map((day, index) => (
                                <span key={index}>
                                  {WEEKDAYS[day][1]}{" "}
                                  {/* Display the short name */}
                                  {index < weekDays.length - 1 && ", "}{" "}
                                  {/* Add comma separator except for the last item */}
                                </span>
                              ))}{" "}
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
                  </>
                ) : (
                  <div className="text-center text-dark-300">
                    No session has been assigned to the user
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalUserModal;
