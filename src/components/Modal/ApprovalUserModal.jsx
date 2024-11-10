import React, { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { BsArrowUpRightSquare } from "react-icons/bs";
import { toast } from "react-toastify";
import useClickOutside from "@/providers/useClickOutside";
import {
  DeleteAssignedSessions,
  getApplicationUserDetails,
  getCourseByProgId,
  getInstructorPreferredSessions,
  getSuggestedSessionForStudent,
} from "@/api/route";
import {
  assignSessionToInstructor,
  assignSessiontoStudent,
  getInstructorSessions,
  listAllSessions,
} from "@/api/route";
import { IoIosArrowDown, IoIosCloseCircleOutline } from "react-icons/io";
import { downloadFile } from "@/app/courses/course/[courseId]/page";
import DeleteConfirmationPopup from "./DeleteConfirmationPopUp";

const ApprovalUserModal = ({
  selectedOption,
  setModal,
  firstName,
  lastName,
  email,
  resume,
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
  const [selectedSessionEndDate, setSelectedSessionEndDate] = useState(null);
  const [selectedSessionStartDate, setSelectedSessionStartDate] =
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
  const [sessionId, setSessionId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
  const button = useRef(null);

  useClickOutside(click, button, () => setShowDropdown(false));

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

    if (id && selectedOption) {
      handleUserDetails();
    }
  }, [id, selectedOption]);

  useEffect(() => {
    const handleCoursesByPrograms = async () => {
      try {
        const response = await getCourseByProgId(userProgramId);
        // console.log("courses by program", response?.data?.data);
        setUserPorgramCourses(response?.data?.data);
      } catch (error) {
        console.log("error while fetching the courses by program id", error);
      }
    };
    if (userProgramId) {
      handleCoursesByPrograms();
    }
  }, [userProgramId]);

  useEffect(() => {
    const handleSuggestedSessionsForInstructor = async () => {
      setLoadingSessions(true);
      try {
        const response = await getInstructorPreferredSessions(id);
        console.log("instructor suggested sessions", response);
        setSessions(response.data.data.sessions);
      } catch (error) {
        console.log(
          "error while fetching the suggested sessions for isntructor",
          error
        );
      } finally {
        setLoadingSessions(false);
      }
    };
    if (selectedOption === "instructor" && id) {
      handleSuggestedSessionsForInstructor();
      setSelected(false);
    }
  }, [id, selectedOption]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleSelectSession = (session) => {
    if (selectedOption === "instructor") {
      setSessionIds((prevSelected) => {
        if (prevSelected.includes(session.id)) {
          return prevSelected.filter((id) => id !== session.id);
        } else {
          return [...prevSelected, session.id];
        }
      });
    } else {
      setSessionIds((prevSelected) => {
        // If the session is already selected, deselect it (clear)
        if (prevSelected.includes(session.id)) {
          return [];
        } else {
          // Otherwise, select the new session, and clear previous selections
          return [session.id];
        }
      });
    }
  };

  useEffect(() => {
    if (sessionIds.length > 0) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [sessionIds]);

  useEffect(() => {
    const handleGetSuggestedSessions = async () => {
      try {
        const response = await getSuggestedSessionForStudent(
          userProgramId,
          userLocationID,
          id
        );
        setStudentSessions(response.data.data.sessions);
        console.log("response of the suggested sessions", response.data);
      } catch (error) {
        console.log("error while fetching suggested sessions", error.response);
      }
    };
    if (selectedOption === "student" && userLocationID && userProgramId) {
      handleGetSuggestedSessions();
    }
  }, [userProgramId, userLocationID, id, selectedOption]);

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
      setSelected(false);
      setSessionIds([]);
      setLoadingAssign(false);
    } catch (error) {
      console.log("Error in assigning", error);
      if (error.message === "Network Error") {
        toast.error(error.message);
      } else if (error.response.status === 400) {
        setUpdateSessions(updateSession + 1);
        toast.error(error.response.data.message);
      } else if (error.response.status === 401) {
        toast.error("your log in token has been expired. Please log in again!");
      }
      setSelected(false);
      setSessionIds([]);
      setLoadingAssign(false);
    }
  };

  useEffect(() => {
    const handleUserSessions = async () => {
      setLoadingSelection(true);
      try {
        const response = await getInstructorSessions(id, selectedOption);
        // console.log("ye rahe sessions", response?.data?.data);
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
    setSelectedSessionEndDate(session.end_date);
    setSelectedSessionStartDate(session.start_date);

    setWeekDays(session.schedules);
    if (session.status === 1) {
      setSelectedSessionStatus("Active");
    } else {
      setSelectedSessionStatus("Inactive");
    }
    setIsSessionSelected(session);
  };

  const handleDeleteSession = (session) => {
    setSessionId(session.session_id);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      const response = await DeleteAssignedSessions(
        id,
        selectedOption,
        sessionId
      );
      console.log("session deleted", response.data);
      toast.success("Session removed succesfully!");
      setUpdateSessions(updateSession + 1);
    } catch (error) {
      console.log("error removing assigned session", error);
    }
  };

  return (
    <div className="backDropOverlay h-screen flex items-center justify-center ">
      <div className="lg:w-[60%] md:w-[80%] w-[95%] z-[1000] mx-auto my-20 relative cursor-default">
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
                                  <p className="px-4 w-[330px]">
                                    {" "}
                                    - {course.name}
                                  </p>
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
                  </>
                )}
              </div>
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
            </div>
            <div className="absolute top-[60px] right-[50px]">
              <p className="text-sm text-dark-400 text-center pb-1 border-b border-dark-300">
                Status
              </p>
              <div className="py-2 whitespace-nowrap flex w-full justify-start text-sm text-surface-100 dark:text-gray-200">
                <p
                  className={`${
                    status === "pending"
                      ? "bg-[#DDF8EE] text-blue-300 border border-blue-300"
                      : "bg-mix-300"
                  } w-[120px] text-center px-4 py-2 rounded-lg capitalize`}
                >
                  {status}
                </p>
              </div>
            </div>
            {selectedOption === "instructor" && (
              <div className="absolute top-[61px] left-[50px]">
                <p className="text-sm text-dark-400 text-center pb-1 border-b border-dark-300">
                  Resume
                </p>
                <div className="px-4">
                  {resume &&
                  resume !== "undefined/undefined" &&
                  resume !== "null" ? (
                    <p className="max-w-[140px] truncate pt-[2px] text-[#43434a] text-sm">
                      <button
                        onClick={() => downloadFile(resume)}
                        // href={resume}
                        // target="_blank"
                        // rel="noopener noreferrer"
                        className=" hover:text-blue-300 hover:underline"
                      >
                        {resume.split("/").pop()}{" "}
                        {/* Display only the filename */}
                      </button>
                    </p>
                  ) : (
                    <p className="text-[12px]  pt-[2px] text-dark-300">
                      no file uploaded
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className={`flex justify-end items-center w-full`}>
              <div className="flex flex-col justify-end  pt-4  relative min-w-[250px]">
                {/* <div>
                <p className=" text-xs">Assign sessions</p>
              </div> */}
                <div className="relative bg-surface-100 rounded-xl">
                  <button
                    ref={button}
                    className="flex  items-center justify-between border-dark-200 border rounded-lg text-dark-400 text-center p-2  w-full "
                    onClick={handleToggle}
                  >
                    <span>Assign classes</span>
                    <span
                      className={
                        showDropdown
                          ? "rotate-180 duration-300"
                          : "duration-300"
                      }
                    >
                      <IoIosArrowDown />
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
                                 : "bg-surface-100"
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
                         isSelected
                           ? "bg-blue-100 text-blue-800"
                           : "bg-surface-100"
                       }
              hover:bg-dark-200 transition-colors duration-200 ease-in-out`}
                              >
                                {session.location_name} - {session.course.name}
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-2 px-4 w-[250px] text-center text-sm text-dark-300">
                            No sessions available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className=" pt-4 px-2 ">
                <button
                  disabled={!selected}
                  className={`bg-blue-300 ${
                    selected ? "" : "opacity-30 cursor-not-allowed"
                  } text-surface-100 py-[10px] w-[100px] text-sm h-fit rounded-md flex justify-center items-center`}
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
                        Assigned Classes:
                      </h2>
                      <ul className="list-disc  max-h-[220px] overflow-y-auto w-full scrollbar-webkit ">
                        {assignedSessions.map((session, index) => (
                          <li
                            key={index}
                            onClick={() => handleSessionInfo(session)}
                            className={`cursor-pointer ${
                              isSessionSelected === session
                                ? "text-blue-300"
                                : ""
                            } flex gap-5 group items-center justify-between w-full hover:bg-[#1d1c1c] hover:bg-opacity-5 px-2 py-1 rounded-lg`}
                          >
                            {session.location} - {session.course}
                            <span className="mt-[2px] group-hover:text-[#1d1c1c90] text-opacity-0 text-[#1d1c1c]  ">
                              <IoClose
                                size={16}
                                className="hover:text-[#1d1c1ce2]"
                                title="remove"
                                onClick={() => handleDeleteSession(session)}
                              />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="w-[1.5px] h-[150px] bg-dark-200 rounded-lg"></div>
                    <div className="w-[50%]">
                      <table className="w-full border-collapse mb-3">
                        <tbody>
                          {/* First Part (Two Columns) */}
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
                              Status
                            </td>
                            <td className="text-center py-2">
                              {selectedSessionStatus || "-"}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Scrollable Section */}
                      <div className="w-full overflow-y-auto max-h-40 scrollbar-webkit">
                        <table className="w-full border-collapse">
                          <thead className="sticky top-0 bg-surface-100 z-10 shadow shadow-dark-200">
                            <tr className="border-b  border-[#d7e4ee]">
                              <th className="text-dark-400 font-normal text-center py-2">
                                Days
                              </th>
                              <th className="text-dark-400 font-normal text-center py-2">
                                Start Time
                              </th>
                              <th className="text-dark-400 font-normal text-center py-2">
                                End Time
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {weekDays.length > 0 ? (
                              weekDays.map((week, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-[#d7e4ee] last:border-0"
                                >
                                  <td className="text-center py-2">
                                    {week.day_of_week}
                                  </td>
                                  <td className="text-center py-2">
                                    {week.start_time}
                                  </td>
                                  <td className="text-center py-2">
                                    {week.end_time}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="3" className="text-center py-2">
                                  No time is scheduled
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
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
        {confirmDelete && (
          <DeleteConfirmationPopup
            setConfirmDelete={setConfirmDelete}
            handleDelete={handleDelete}
            field="assigned class"
          />
        )}
      </div>
    </div>
  );
};

export default ApprovalUserModal;
