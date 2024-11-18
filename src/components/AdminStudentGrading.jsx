"use client";
import {
  getAttendanceByCourseId,
  getAttendanceBySessionId,
  getInstructorSessions,
  getInstructorSessionsbyCourseId,
  getStudentsByCourseId,
  lisStudentsByBatch,
  listAllBatches,
  listAllSessions,
  listSessionByCourseId,
  markAttendanceByCourseId,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { Try } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const AdminStudentGrading = ({ courseId }) => {
  const { userData } = useAuth();
  const [attendance, setAttendance] = useState([]);

  const [getAttendance, setGetAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const [loader, setLoader] = useState(false);
  const [instructorSessions, setInstructorSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminSessions, setAdminSessions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [id, setId] = useState();
  const group = userData?.Group;
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
  const userId = userData?.user_data?.id;

  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const handleChange = (e) => {
    //console.log("chal rahi he", e.target.value);
    setSelectedSessionId(e.target.value);
  };

  const handleBatchSelection = (e) => {
    //console.log("chal rahi he", e.target.value);
    setSelectedBatchId(e.target.value);
  };

  async function fetchSessions() {
    setLoading(true);
    try {
      const response = await getInstructorSessionsbyCourseId(
        userId,
        group,
        courseId
      );
      if (response.status === 200) {
        setInstructorSessions(response.data);
      } else {
        //console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAttendanceAdmin() {
    setLoading(true);
    try {
      const response = await getAttendanceBySessionId(selectedSessionId);
      if (response.status === 200) {
        // //console.log("attendence in students", response.data.data.students);
        setAttendance(response.data.data.students);
      } else {
        //console.error("Failed to fetch attendance, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    } finally {
      setLoading(false);
    }
  }
  // async function fetchStudentsByBatch() {
  //   setLoading(true);
  //   try {
  //     const response = await lisStudentsByBatch(selectedBatchId);
  //     if (response.status === 200) {
  //       // //console.log("attendence in students", response.data.data.students);
  //       setAttendance(response.data.data);
  //     } else {
  //       //console.error("Failed to fetch attendance, status:", response.status);
  //     }
  //   } catch (error) {
  //     //console.log("error", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const fetchAllSessions = async () => {
    try {
      const response = await listSessionByCourseId(courseId);
      // //console.log('admin sessions', response.data )
      setAdminSessions(response.data.data);
    } catch (error) {
      //console.log("fetching sessions", error);
    }
  };

  useEffect(() => {
    const getBatch = async () => {
      try {
        const response = await listAllBatches();
        setLoadingBatch(true);
        const batchOptionsArray = response?.data.map((batch) => batch.batch);
        setBatches(batchOptionsArray);
      } catch (error) {
        // console.log("error while fetching the batches", error);
        if (error.message === "Network Error") {
          toast.error(error.message, "Check your internet connection");
        }
      } finally {
        setLoadingBatch(false);
      }
    };
    getBatch();
  }, []);

  // useEffect(() => {
  //   fetchStudentsByBatch();
  // }, [selectedBatchId]);

  useEffect(() => {
    fetchAttendanceAdmin();
    // fetchStudentsbySession();
    if (isInstructor) {
      fetchSessions();
    } else {
      fetchAllSessions();
    }
  }, [selectedSessionId]);

  return (
    <div className="flex flex-col">
      <div className="flex w-full gap-2">
        {/* <div className="w-full">
          <label className="text-blue-500 font-semibold">Select batch</label>

          <select
            value={selectedBatchId}
            onChange={handleBatchSelection}
            className="bg-surface-100 block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          >
            <option
              className="bg-surface-100 block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              value=""
              disabled
              // selected
            >
              Select a batch
            </option>

            {batches && batches.length > 0 ? (
              batches.map((option, index) => (
                <option key={index}>{option}</option>
              ))
            ) : (
              // ) : adminSessions && adminSessions.length > 0 ? (
              //   adminSessions.map((session) => (
              //     <option key={session.id} value={session.id}>
              //       {session.location_name} - {session.course.name} -{" "}
              //       {session.no_of_student} - {session.start_time} -{" "}
              //       {session.end_time}
              //     </option>
              //   ))
              <option value="" disabled>
                No Batches found
              </option>
            )}
          </select>
        </div> */}
        <div className="w-full">
          <label className="text-blue-500 font-semibold">Select Session</label>

          <select
            value={selectedSessionId}
            onChange={handleChange}
            className="bg-surface-100 block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          >
            <option
              className="bg-surface-100 block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              value=""
              disabled
              // selected
            >
              Select a session
            </option>

            {Array.isArray(instructorSessions.data) &&
            instructorSessions.data.length > 0 ? (
              instructorSessions.data.map((session) => (
                <option key={session.session_id} value={session.session_id}>
                  {session.location} - {session.course} -{" "}
                  {session.no_of_student} - {session.start_time} -{" "}
                  {session.end_time}
                </option>
              ))
            ) : adminSessions && adminSessions.length > 0 ? (
              adminSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.location_name} - {session.course.name} -{" "}
                  {session.no_of_student} - {session.start_time} -{" "}
                  {session.end_time}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No session found
              </option>
            )}
          </select>
        </div>
      </div>

      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden rounded-lg">
              <div className="relative max-h-[54vh] overflow-y-auto scrollbar-webkit">
                <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                  <thead className="bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
                    <tr>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                        Student ID
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                        Student Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-200 dark:divide-gray-700 overflow-y-scroll scrollbar-webkit">
                    {loading ? (
                      <tr>
                        <td colSpan="10" className="py-4 text-center">
                          <div className="flex justify-center items-center w-full">
                            <CircularProgress size={22} />
                          </div>
                        </td>
                      </tr>
                    ) : attendance && attendance.length > 0 ? (
                      attendance?.map((att, index) => {
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                              {att.registration_id}
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 hover:text-blue-300">
                              <Link
                                href={`/students/course/${courseId}/student/${selectedSessionId}/${att.registration_id}/`}
                              >
                                {att.user || att.name}
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center text-sm text-dark-300 py-4"
                        >
                          No students found
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
    </div>
  );
};

export default AdminStudentGrading;
