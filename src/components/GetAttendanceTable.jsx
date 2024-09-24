"use client";
import {
  getAttendanceByCourseIdDate,
  getAttendanceBySessionId,
  getAttendanceBySessionIdnCourseId,
  getInstructorSessions,
  getInstructorSessionsbyCourseId,
  getStudentsByCourseId,
  markAttendanceByCourseId,
  postAttendanceBySessionId,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Ensure you have react-toastify installed

export default function GetAttendanceTable({ courseId, isAttendancePosted }) {
  const { userData } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [getAttendance, setGetAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const [loader, setLoader] = useState(false);
  const [sessions, setSessions] = useState([]);
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

  const [selectedSession, setSelectedSession] = useState("");
  const [date, setDate] = useState(null);
  const [toggleMark, setToggleMark] = useState(false);
  // console.log(group, userId);
  async function fetchSessions() {
    const response = await getInstructorSessionsbyCourseId(
      userId,
      group,
      courseId
    );
    setLoader(true);
    try {
      if (response.status === 200) {
        setSessions(response.data.data); // Store the sessions data
        setLoader(false);
      } else {
        console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchAttendance() {
    try {
      const response = await getAttendanceBySessionId(selectedSession);
      if (response.status === 200) {
        console.log();
        const initialAttendance = response.data.data.students.reduce(
          (acc, student) => {
            acc[student.registration_id] = 0;
            return acc;
          },
          {}
        );

        console.log("attendence", response.data.data.students);
        setGetAttendance(response.data.data.students);
        setSelectedAttendance(initialAttendance);
        fetchAttendanceIns();
      } else {
        console.error("Failed to fetch attendance, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  }

  async function fetchAttendanceIns() {
    try {
      const response = await getAttendanceBySessionIdnCourseId(
        selectedSession,
        courseId,
        date
      );
      if (response.status === 200) {
        console.log("attendece per session", response.data);
        setAttendance(response.data.data.attendance);
        const initialAttendance = response.data.data.attendance.reduce((acc, student) => {
          acc[student.student] = 0;
          return acc;
        }, {});
        // console.log(response.data.data);
        setSelectedAttendance(initialAttendance);
        // console.log(response.data);
      } else {
        console.error("Failed to fetch attendance, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
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
    const attendanceArray = Object.keys(selectedAttendance).map(
      (studentId) => ({
        student: studentId,
        status: selectedAttendance[studentId],
        course: parseInt(courseId),
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
      } else {
        toast.error(`Error submitting attendance: ${response.data.message}`);
      }
    } catch (error) {
      toast.error("Error submitting attendance");
      console.error("Error submitting attendance:", error);
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
    isInstructor && fetchSessions();
  }, []);

  useEffect(() => {
    if (date && selectedSession) {
      fetchAttendanceIns();
    }
  }, [courseId, selectedSession, date]);

  // useEffect(() => {
  //   fetchAttendance();
  // }, [selectedSession]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value; // Input date is already in YYYY-MM-DD format
    console.log(selectedDate);
    setDate(selectedDate); // This will correctly store the date in the state
    // fetchAttendanceIns();
  };

  const handleCheckboxChange = (e) => {
    setToggleMark(e.target.checked);
    setDate("");
  };
  // console.log(selectedSessionId);

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 w-full justify-end items-center pr-4 pb-2">
        <input
          type="checkbox"
          checked={toggleMark}
          onChange={handleCheckboxChange}
        />
        <p>Mark Attendance</p>
      </div>
      {isInstructor && (
        <div className="flex items-center gap-3">
          <div className="w-full">
            <label>Select Session</label>

            <select
              value={selectedSession} // Selected session name or value
              onChange={(e) => handleChange(e)} // Call handleChange on selection
              className="bg-surface-100 block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            >
              <option value="" disabled>
                Select a session
              </option>
              {Array.isArray(sessions) &&
                sessions.map((session) => (
                  <option
                    key={session.session_id}
                    value={session.session_id} // Value is session_id
                  >
                    {session.location} - {session.course} -{" "}
                    {session.no_of_student} - {session.start_time} -{" "}
                    {session.end_time}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <p>Select Date</p>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              disabled={toggleMark} // Disable when toggleMark is true
              className={`${
                toggleMark
                  ? "text-dark-300 cursor-not-allowed"
                  : "text-[#424b55] cursor-default"
              } border border-dark-300  outline-none px-3 py-2 my-2 rounded-lg w-full`}
              placeholder="Select start date"
            />
          </div>
        </div>
      )}

      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                <thead className="bg-dark-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                      Student ID
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                      Student Name
                    </th>
                    {attendance && attendance.length > 0 && (
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
                  {!toggleMark && date &&
                  selectedSession &&
                  Array.isArray(attendance) &&
                  attendance.length > 0 ? (
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
                                  selectedAttendance[att.student] ===
                                  parseInt(status)
                                }
                                disabled={true}
                                className="w-4 h-4 rounded-full border-2 border-[#03A1D8] group-hover:cursor-pointer"
                                // disabled={isAttendancePosted}
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
                  ) : toggleMark &&
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
                                  selectedAttendance[
                                    att.student || att.registration_id
                                  ] === parseInt(status)
                                }
                                onChange={() =>
                                  handleAttendanceChange(
                                    att.registration_id,
                                    parseInt(status)
                                  )
                                }
                                className="w-4 h-4 rounded-full border-2 border-[#03A1D8] group-hover:cursor-pointer"
                                disabled={isAttendancePosted}
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
                        No attendance data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {selectedSession && toggleMark && getAttendance.length > 0 && (
        <button
          onClick={handleSubmit}
          className={`${
            date ? "bg-blue-200 cursor-not-allowed" : "bg-blue-300"
          }  from-dark-600 text-surface-100 p-2 rounded-md w-20 my-2 flex justify-center`}
          type="button"
          disabled={date}
        >
          Submit
        </button>
      )}
    </div>
  );
}
