"use client";
import {
  getAttendanceByCourseIdDate,
  getAttendanceBySessionIdnCourseId,
  getInstructorSessions,
  getStudentAttendanceForAdmin,
  getStudentsByCourseId,
  listAllSessions,
  listSessionByCourseId,
  markAttendanceByCourseId,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Ensure you have react-toastify installed

export default function GetAttendanceAdminTable({
  sessionId,
  courseId,
  isAttendancePosted,
}) {
  const { userData } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [getAttendance, setGetAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const [adminStudentAttendence, setAdminStudentAttendence] = useState([]);
  const [loader, setLoader] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [date, setDate] = useState(null);
  const group = userData?.Group;
  const userId = userData?.user_data?.id;
  // //console.log(courseId,'course id');
  // //console.log(userData);
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // //console.log(group, userId);
  // async function fetchSessions() {
  //   const response = await getInstructorSessions(userId, group);
  //   setLoader(true);
  //   try {
  //     if (response.status === 200) {
  //       setSessions(response.data);
  //       setLoader(false);
  //       // //console.log(assignments);
  //     } else {
  //       //console.error(
  //         "Failed to fetch pending assignments, status:",
  //         response.status
  //       );
  //     }
  //   } catch (error) {
  //     //console.log("error", error);
  //   }
  // }

  // async function fetchAttendanceAdmin() {
  //   try {
  //     const response = await getStudentsByCourseId(courseId);
  //     if (response.status === 200) {
  //       const initialAttendance = response.data.reduce((acc, student) => {
  //         acc[student.registration_id] = 0;
  //         return acc;
  //       }, {});
  //       setAttendance(response.data);
  //       setSelectedAttendance(initialAttendance);
  //     } else {
  //       //console.error("Failed to fetch attendance, status:", response.status);
  //     }
  //   } catch (error) {
  //     //console.error("Error fetching attendance:", error);
  //   }
  // }

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
  //       //console.error("Failed to fetch attendance", response.status);
  //     }
  //   } catch (error) {
  //     //console.error("Error fetching attendance:", error);
  //   } finally {
  //     setLoader(false);
  //   }
  // }

  // const handleAttendanceChange = (regId, status) => {
  //   setSelectedAttendance((prevState) => ({
  //     ...prevState,
  //     [regId]: status,
  //   }));
  // };

  // const handleSubmit = async () => {
  //   const attendanceArray = Object.keys(selectedAttendance).map(
  //     (studentId) => ({
  //       student: studentId,
  //       status: selectedAttendance[studentId],
  //     })
  //   );

  //   try {
  //     const response = await markAttendanceByCourseId(
  //       courseId,
  //       attendanceArray
  //     ); // Post the array of attendance
  //     if (response.status === 200 || response.status === 201) {
  //       toast.success("Attendance marked successfully");
  //       fetchAttendance(); // Fetch updated attendance after submission
  //     } else {
  //       toast.error(`Error submitting attendance: ${response.data.message}`);
  //     }
  //   } catch (error) {
  //     toast.error("Error submitting attendance");
  //     //console.error("Error submitting attendance:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchAttendance();
  //   if (group && userId) {
  //     fetchSessions();
  //   }
  //   if (isAttendancePosted) {
  //     fetchAttendance();
  //   } else {
  //     fetchAttendanceAdmin();
  //   }
  // }, [isAttendancePosted, courseId, group, userId]);

  const fetchAllSessions = async () => {
    try {
      const response = await listSessionByCourseId(courseId);
      // //console.log('sessions in attendence', response.data.data)
      setSessions(response?.data?.data);
    } catch (error) {
      //console.log("fetching sessions", error);
    }
  };

  const handleChange = (e) => {
    const session_id = e.target.value;
    //console.log("session id", session_id);
    setSelectedSessionId(session_id); // Update the selected session ID
  };

  const handleAdminStudentAttendence = async () => {
    setLoader(true);
    try {
      const response = await getAttendanceBySessionIdnCourseId(
        selectedSessionId,
        courseId,
        date
      );
      //console.log("response for admin attendence", response.data.data);
      setGetAttendance(response.data.data.attendance);
      const initialAttendance = response.data.reduce((acc, student) => {
        acc[student.student] = 0;
        return acc;
      }, {});
      setSelectedAttendance(initialAttendance);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    //console.log(selectedDate);
    setDate(selectedDate);
    // fetchAttendanceIns();
  };
  //console.log(date);
  useEffect(() => {
    if (group === "admin" && selectedSessionId && date) {
      handleAdminStudentAttendence();
    }
  }, [selectedSessionId, date]);

  return (
    <div className="flex flex-col  ">
      <div>
        <div className=" flex w-full gap-2 max-md:flex-col">
          <div className="w-full">
            <label className="text-blue-500 text-bold">
              {" "}
              <label className="text-blue-500 font-semibold">
                Select Session
              </label>
            </label>
            <select
              value={selectedSessionId}
              onChange={handleChange}
              className="bg-surface-100 cursor-pointer block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            >
              <option
                className="bg-surface-100 block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                value=""
                disabled
                // selected;
              >
                Select a session
              </option>
              {sessions &&
                sessions.length > 0 &&
                sessions.map((session) => (
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
              className="text-[#424b55]  cursor-default border border-dark-300  focus:border-blue-300 outline-none px-3 py-2 my-2 rounded-lg w-full"
              placeholder="Select start date"
            />
          </div>
        </div>
      </div>
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
                    <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                      Date
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200 dark:divide-gray-700 overflow-y-scroll scrollbar-webkit">
                  {getAttendance && getAttendance.length > 0 ? (
                    getAttendance.map((att, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                          {att.student}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                          {att.student_name}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                          {att.date}
                        </td>
                        <td className="px-6 py-4 gap-3 flex text-center justify-center items-center whitespace-nowrap text-sm text-gray-800">
                          {["0", "1", "2"].map((status) => (
                            <div
                              key={status}
                              className="space-x-2 flex items-center group"
                            >
                              <input
                                type="radio"
                                name={`attendance-${att.id}`}
                                value={status}
                                checked={att.status === parseInt(status)}
                                className="w-4 h-4 rounded-full border-2 border-[#03A1D8] group-hover:cursor-pointer"
                                disabled={true}
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
                    // : attendance.length > 0 ? (
                    //   attendance.map((att, index) => (
                    //     <tr key={index}>
                    //       <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                    //         {att.registration_id}
                    //       </td>
                    //       <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                    //         {att.full_name}
                    //       </td>
                    //       <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                    //         {att.date}
                    //       </td>
                    //       <td className="px-6 py-4 gap-3 flex text-center justify-center items-center whitespace-nowrap text-sm text-gray-800">
                    //         {["0", "1", "2"].map((status) => (
                    //           <div
                    //             key={status}
                    //             className="space-x-2 flex items-center group"
                    //           >
                    //             <input
                    //               type="radio"
                    //               name={`attendance-${att.registration_id}`}
                    //               value={status}
                    //               checked={
                    //                 selectedAttendance[att.registration_id] ===
                    //                 parseInt(status)
                    //               }
                    //               onChange={() =>
                    //                 handleAttendanceChange(
                    //                   att.registration_id,
                    //                   parseInt(status)
                    //                 )
                    //               }
                    //               className="w-4 h-4 rounded-full border-2 border-[#03A1D8] group-hover:cursor-pointer"
                    //               disabled={isAttendancePosted}
                    //             />
                    //             <p className="group-hover:cursor-pointer">
                    //               {status === "0"
                    //                 ? "P"
                    //                 : status === "1"
                    //                 ? "A"
                    //                 : "L"}
                    //             </p>
                    //           </div>
                    //         ))}
                    //       </td>
                    //     </tr>
                    //   ))
                    // )
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4 text-dark-400"
                      >
                        no data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {attendance.length > 0 && !isAttendancePosted && (
        <button
          onClick={handleSubmit}
          className="bg-blue-300 from-dark-600 text-surface-100 p-2 rounded-md w-20 my-2 flex justify-center"
          type="button"
        >
          Submit
        </button>
      )}
    </div>
  );
}
