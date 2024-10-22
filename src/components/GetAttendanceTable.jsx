"use client";
import {
  getAttendanceByCourseIdDate,
  getAttendanceBySessionId,
  getAttendanceBySessionIdnCourseId,
  getInstructorSessions,
  getInstructorSessionsbyCourseId,
  getStudentsByCourseId,
  listSessionByCourseId,
  markAttendanceByCourseId,
  patchAttendanceBySessionId,
  postAttendanceBySessionId,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Ensure you have react-toastify installed

export default function GetAttendanceTable({ courseId, isAttendancePosted }) {
  const { userData } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [getAttendance, setGetAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const [loader, setLoader] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [getting, setGetting] = useState(false);
  const [edit, setEdit] = useState(false);
  const group = userData?.Group;
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
  const userId = userData?.user_data?.id;
  // console.log(group);
  // console.log(userData);
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  // console.log(formattedDate, "formated");
  // const today = new Date().toISOString().split("T")[0];

  const [selectedSession, setSelectedSession] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [date, setDate] = useState(null);
  const [toggle, setToggle] = useState(false);
  // console.log(group, userId);
  async function fetchSessions() {
    const response = await getInstructorSessionsbyCourseId(
      userId,
      group,
      courseId
    );

    try {
      if (response.status === 200) {
        setSessions(response.data.data); // Store the sessions data
      } else {
        console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const fetchAllSessions = async () => {
    try {
      const response = await listSessionByCourseId(courseId);
      // console.log('sessions in attendence', response.data.data)
      setSessions(response?.data?.data);
    } catch (error) {
      console.log("fetching sessions", error);
    }
  };

  async function fetchAttendance() {
    setGetting(true);
    try {
      const response = await getAttendanceBySessionId(selectedSession);
      if (response.status === 200) {
        const initialAttendance = response.data.data.students.reduce(
          (acc, student) => {
            // Initialize each student's attendance to 0 (Present) initially
            acc[student.registration_id] = 0; // '0' for Present
            return acc;
          },
          {}
        );

        console.log("Attendance:", response.data.data.students);
        setGetAttendance(response.data.data.students); // Setting attendance data
        setSelectedAttendance(initialAttendance); // Setting the initial status to 'Present'
        // Fetch additional attendance insights if needed
      } else {
        console.error("Failed to fetch attendance, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setGetting(false);
    }
  }

  async function fetchAttendanceIns() {
    setGetting(true);
    try {
      const response = await getAttendanceBySessionIdnCourseId(
        selectedSession,
        courseId,
        date
      );
      if (response.status === 200) {
        console.log("attendece per session", response.data);
        setAttendance(response.data.data.attendance);
        const initialAttendance = response.data.data.attendance.reduce(
          (acc, student) => {
            acc[student.student] = 0;
            return acc;
          },
          {}
        );
        // console.log(response.data.data);
        setSelectedAttendance(initialAttendance);
        // console.log(response.data);
      } else {
        console.error("Failed to fetch attendance, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setGetting(false);
    }
  }

  // async function fetchAttendance() {
  //   setLoader(true);
  //   try {
  //     const response = await getAttendanceByCourseIdDate(
  //       courseId,
  //       formattedDate
  //     );
  //     if (response.status === 200) {
  //       setGetAttendance(response.data);

  //       setSelectedAttendance(
  //         response.data.reduce((acc, record) => {
  //           acc[record.student] = record.status;
  //           return acc;
  //         }, {})
  //       );
  //     } else {
  //       console.error("Failed to fetch attendance", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching attendance:", error);
  //   } finally {
  //     setLoader(false);
  //   }
  // }

  const handleAttendanceChange = (regId, status) => {
    setSelectedAttendance((prevState) => ({
      ...prevState,
      [regId]: status,
    }));
  };

  const handleSubmit = async () => {
    setLoader(true);
    const attendanceArray = Object.keys(selectedAttendance).map(
      (studentId) => ({
        student: studentId,
        status: selectedAttendance[studentId],
        course: parseInt(courseId),
        date: date,
      })
    );

    try {
      // const response = await markAttendanceByCourseId(
      //   courseId,
      //   attendanceArray
      // );

      const response = await postAttendanceBySessionId(
        selectedSession,
        courseId,
        attendanceArray
      );
      if (response.status === 200 || response.status === 201) {
        console.log("response for mark attendence", response);
        toast.success("Attendance marked successfully");
        setToggle(!toggle);
      } else {
        toast.error(`Error submitting attendance: ${response.data.message}`);
      }
    } catch (error) {
      // toast.error("Error submitting attendance");
      if (error.response.status === 500) {
        console.error("Error submitting attendance:", error);
        toast.success("Attendance has been marked!");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleEdit = () => {
    setEdit(true);
  
    // Initialize selectedAttendance with the current attendance status
    const initialAttendance = {};
    attendance.forEach((att) => {
      initialAttendance[att.student] = att.status;
    });
    setSelectedAttendance(initialAttendance); // Preload the selectedAttendance with current values
  };
  
  

  const handleResubmission = async () => {
    setLoader(true);
    const attendanceArray = Object.keys(selectedAttendance).map(
      (studentId) => ({
        student: studentId,
        status: selectedAttendance[studentId],
        course: parseInt(courseId),
        date: date,
      })
    );
    try {
      const response = await patchAttendanceBySessionId(
        selectedSession,
        courseId,
        attendanceArray
      );
      console.log("response while resubmission", response);
      toast.success(response.data.message)
      setToggle(!toggle);
      setEdit(false)
    } catch (error) {
      console.log(error, "error while resubmission");
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    const session_id = e.target.value;
    console.log("session id", session_id);
    setSelectedSession(session_id); // Update the selected session ID
  };

  // useEffect(() => {
  //   fetchAttendance();

  //   if (group && userId) {
  //     fetchSessions();
  //   }
  //   if (isAttendancePosted) {
  //     fetchAttendance();
  //     // fetchAttendanceIns();
  //   } else {
  //     fetchAttendanceIns();
  //   }
  // }, [isAttendancePosted, courseId, group, userId, selectedSessionId]);
  useEffect(() => {
    // console.log("isInstructor:", isInstructor);
    // console.log("isAdmin:", isAdmin);

    if (isInstructor) {
      fetchSessions();
    } else if (isAdmin) {
      fetchAllSessions();
    }
  }, [isAdmin, isInstructor]);

  // useEffect(() => {
  //   if (date && selectedSession) {
  //     fetchAttendanceIns();
  //   }
  // }, [courseId, selectedSession, date]);

  useEffect(() => {
    // Only set the date and fetch attendance when the component loads or when selectedSession changes
    if (selectedSession) {
      if (!date) {
        setDate(formattedDate); // Set the default formatted date initially
      } else {
        fetchAttendance();
        fetchAttendanceIns();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession, date, toggle]); // Only run when selectedSession or courseId changes

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    console.log(selectedDate);
    setDate(selectedDate);
  };

  // console.log(selectedSessionId);

  return (
    <div className="flex flex-col">
      {
        <>
          <div className="flex items-center gap-3 w-full max-md:flex-col">
            <div className="w-full">
              <label>
                {" "}
                <label className="text-blue-500 font-semibold">
                  Select Session
                </label>
              </label>

              <select
                value={selectedSession}
                onChange={(e) => handleChange(e)}
                className={` bg-surface-100 block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
              >
                <option value="" disabled>
                  Select a session
                </option>
                {Array.isArray(sessions) && isInstructor
                  ? sessions.map((session) => (
                      <option
                        key={session.session_id}
                        value={session.session_id}
                      >
                        {session.location} - {session.course} -{" "}
                        {session.start_time} - {session.end_time}
                      </option>
                    ))
                  : sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.location_name} - {session.course.name} -{" "}
                        {session.start_time} - {session.end_time}
                      </option>
                    ))}
              </select>
            </div>
            <div className="w-full">
              <label className="text-blue-500 font-semibold">Select Date</label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                // Disable when toggle is true
                className={` border border-dark-300  text-[#424b55] cursor-default outline-none px-3 py-2 my-2 rounded-lg w-full`}
                placeholder="Select start date"
              />
            </div>
          </div>
        </>
      }

      <div className="-m-1.5 overflow-x-auto ">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="mt-2 border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden rounded-lg">
              <div className="relative max-h-[52vh] overflow-y-auto scrollbar-webkit">
                <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                  <thead className="bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
                    <tr>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                        Student ID
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                        Student Name
                      </th>
                      {date && selectedSession && attendance.length > 0 && (
                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                          Date
                        </th>
                      )}
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-200 dark:divide-gray-700 overflow-y-scroll scrollbar-webkit">
                    {getting ? (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-6 py-2 text-center whitespace-nowrap text-sm text-dark-300"
                        >
                          <CircularProgress size={20} />
                        </td>
                      </tr>
                    ) : date && selectedSession && attendance.length > 0 ? (
                      attendance.map((att, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {att.student} {/* Adjusted to match API response */}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {att.student_name}{" "}
                            {/* Adjusted to match API response */}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {att.date || "-"}{" "}
                            {/* Adjusted to match API response */}
                          </td>
                          <td className="px-6 py-4 gap-3 flex text-center justify-center items-center whitespace-nowrap text-sm text-gray-800">
                            {["0", "1", "2"].map((status) => (
                              <div
                                key={status}
                                className="space-x-2 flex items-center group"
                              >
                                <input
                                  type="radio"
                                  name={`attendance-${att.student}`}
                                  value={status}
                                  checked={
                                    !edit
                                      ? att.status === parseInt(status)
                                      : selectedAttendance[att.student] ===
                                        parseInt(status)
                                  }
                                  disabled={!edit}
                                  className="w-4 h-4 rounded-full border-2 
                                  group-hover:cursor-pointer 
                                disabled:group-hover:cursor-default "
                                  onChange={() =>
                                    handleAttendanceChange(
                                      att.student,
                                      parseInt(status)
                                    )
                                  }
                                />
                                <p className="group-hover:cursor-default">
                                  {status === "0"
                                    ? "P"
                                    : status === "1"
                                    ? "A"
                                    : "L"}
                                </p>
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))
                    ) : getting ? (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-6 py-2 text-center whitespace-nowrap text-sm text-dark-300"
                        >
                          <CircularProgress size={20} />
                        </td>
                      </tr>
                    ) : date &&
                      Array.isArray(getAttendance) &&
                      getAttendance.length > 0 ? (
                      getAttendance.map((att, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {att.student || att.registration_id}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {att.full_name || att.user}
                          </td>

                          <td className="px-6 py-4 gap-3 flex text-center justify-center items-center whitespace-nowrap text-sm text-gray-800">
                            {["0", "1", "2"].map((status) => (
                              <div
                                key={status}
                                className="space-x-2 flex items-center group"
                              >
                                <input
                                  type="radio"
                                  name={`attendance-${att.registration_id}`}
                                  value={status}
                                  checked={
                                    selectedAttendance[att.registration_id] ===
                                    parseInt(status)
                                  }
                                  onChange={() =>
                                    handleAttendanceChange(
                                      att.registration_id,
                                      parseInt(status)
                                    )
                                  }
                                  className="w-4 h-4 rounded-full border-2 border-blue-300 group-hover:cursor-pointer"
                                />
                                <p className="group-hover:cursor-pointer">
                                  {status === "0"
                                    ? "P"
                                    : status === "1"
                                    ? "A"
                                    : "L"}
                                </p>
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-6 py-4 text-center whitespace-nowrap text-sm text-dark-300"
                        >
                          No attendance marked
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
      {!edit ? (
        !getting &&
        date &&
        selectedSession &&
        attendance.length > 0 && (
          <div className="flex items-center">
            <div className="w-[40%]">
              <button
                onClick={handleEdit}
                className={` bg-blue-200 hover:bg-blue-300 text-surface-100 p-2 rounded-md w-20 my-2 flex items-center gap-2 justify-center`}
              >
                Edit
              </button>
            </div>
            <p className="text-center text-mix-300 p-3">
              {" "}
              Attendance has been Marked!
            </p>
          </div>
        )
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setEdit(false)}
            className={` bg-surface-200 hover:bg-dark-200 text-dark-400 hover:text-[#000000] p-2 rounded-md w-20 my-2 flex items-center gap-2 justify-center`}
          >
            Cancel
          </button>
          <button
            onClick={handleResubmission}
            className={` bg-blue-200 hover:bg-blue-300 text-surface-100 p-2 rounded-md w-20 my-2 flex items-center gap-2 justify-center`}
          >
            {loader ? (
              <CircularProgress
                size={20}
                style={{ color: "#ffffff" }}
                className="m-[2px]"
              />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      )}
      {!getting &&
        date &&
        selectedSession &&
        getAttendance.length > 0 &&
        attendance.length === 0 && (
          <button
            onClick={handleSubmit}
            className={` bg-blue-200 hover:bg-blue-300 text-surface-100 p-2 rounded-md w-20 my-2 flex items-center gap-2 justify-center`}
            type="button"
          >
            {loader ? (
              <CircularProgress
                size={20}
                style={{ color: "#ffffff" }}
                className="m-[2px]"
              />
            ) : (
              "Submit"
            )}
          </button>
        )}
    </div>
  );
}
