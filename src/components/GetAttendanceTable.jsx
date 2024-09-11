"use client";
import {
  getAttendanceByCourseIdDate,
  getStudentsByCourseId,
  markAttendanceByCourseId,
} from "@/api/route";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Ensure you have react-toastify installed

export default function GetAttendanceTable({ courseId, isAttendancePosted }) {
  const [attendance, setAttendance] = useState([]);
  const [getAttendance, setGetAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const [loader, setLoader] = useState(false);
  const [id, setId] = useState();

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  async function fetchAttendanceAdmin() {
    try {
      const response = await getStudentsByCourseId(courseId);
      if (response.status === 200) {
        const initialAttendance = response.data.reduce((acc, student) => {
          acc[student.registration_id] = 0;
          return acc;
        }, {});
        setAttendance(response.data);
        setSelectedAttendance(initialAttendance);
      } else {
        console.error("Failed to fetch attendance, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  }

  async function fetchAttendance() {
    setLoader(true);
    try {
      const response = await getAttendanceByCourseIdDate(
        courseId,
        formattedDate
      );
      if (response.status === 200) {
        setGetAttendance(response.data);
        setSelectedAttendance(
          response.data.reduce((acc, record) => {
            acc[record.student] = record.status;
            return acc;
          }, {})
        );
      } else {
        console.error("Failed to fetch attendance", response.status);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoader(false);
    }
  }

  const handleAttendanceChange = (regId, status) => {
    setId(regId);
    setSelectedAttendance((prevState) => ({
      ...prevState,
      [regId]: status,
    }));
  };

  const handleSubmit = async () => {
    const attendanceData = {
      student: id,
      status: selectedAttendance[id],
    };
    try {
      const response = await markAttendanceByCourseId(courseId, attendanceData);
      console.log(courseId)
      if (response.status === 200 || response.status === 201) {
        toast.success("Attendance marked successfully");
        fetchAttendance(); // Fetch updated attendance after submission
      } else {
        toast.error(`Error submitting attendance: ${response.data.message}`);
      }
    } catch (error) {
      toast.error("Error submitting attendance");
      console.error("Error submitting attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
    if (isAttendancePosted) {
      fetchAttendance();
    } else {
      fetchAttendanceAdmin();
    }
  }, [isAttendancePosted, courseId]);

  return (
    <div className="flex flex-col">
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
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200 dark:divide-gray-700 overflow-y-scroll scrollbar-webkit">
                  {getAttendance.length > 0
                    ? getAttendance.map((att, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {att.student || att.registration_id}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {att.full_name || att.student_name}
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
                                  checked={
                                    selectedAttendance[att.student] ===
                                    parseInt(status)
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
                    : attendance.map((att, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {att.registration_id}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {att.full_name}
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
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {attendance.length > 0 &&
        !isAttendancePosted &&
        // getAttendance.length === 0 && (
        (  <button
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
