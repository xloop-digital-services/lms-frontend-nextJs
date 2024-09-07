"use client";
import {
  getAttendanceByCourseId,
  getStudentsByCourseId,
  markAttendanceByCourseId,
} from "@/api/route";
import React, { useEffect, useState } from "react";

const Table = ({ courseId }) => {
  const [attendance, setAttendance] = useState([]);
  const [getAttendance, setGetAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const [loader, setLoader] = useState(false);
  const [id, setId] = useState();
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
      console.log("error", error);
    }
  }

  async function fetchAttendance() {
    const response = await getAttendanceByCourseId(courseId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setGetAttendance(response.data);
        setLoader(false);
        console.log(attendance);
        console.log(response.data);
      } else {
        console.error("Failed to fetch attendance", response.status);
        setLoader(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoader(false);
    }
  }

  const handleAttendanceChange = (regId, status) => {
    setId(regId)
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

      if (response.status === 200) {
        console.log(`Attendance for marked successfully.`);
      } else {
        console.error(`Failed to mark attendance for student ${regId}`);
      }
      fetchAttendance();
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchAttendanceAdmin();
  }, []);

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
                  {attendance.map((att, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {att.registration_id}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {att.full_name}
                      </td>
                      <td className="px-6 py-4 gap-3 flex text-center justify-center items-center whitespace-nowrap text-sm text-gray-800">
                        <div className="space-x-2 flex items-center justify-center group">
                          <input
                            type="radio"
                            name={`attendance-${att.registration_id}`}
                            value="0"
                            checked={
                              selectedAttendance[att.registration_id] === 0
                            }
                            onChange={() =>
                              handleAttendanceChange(att.registration_id, 0)
                            }
                            className="w-4 h-4 rounded-full border-2 border-[#03A1D8] group-hover:cursor-pointer"
                          />
                          <p className="group-hover:cursor-pointer">P</p>
                        </div>
                        <div className="space-x-2 flex items-center group">
                          <input
                            type="radio"
                            name={`attendance-${att.registration_id}`}
                            value="1"
                            checked={
                              selectedAttendance[att.registration_id] === 1
                            }
                            onChange={() =>
                              handleAttendanceChange(att.registration_id, 1)
                            }
                            className="w-4 h-4 rounded-full border-2 border-[#03A1D8] group-hover:cursor-pointer"
                          />
                          <p className="group-hover:cursor-pointer">A</p>
                        </div>
                        <div className="space-x-2 flex items-center group">
                          <input
                            type="radio"
                            name={`attendance-${att.registration_id}`}
                            value="2"
                            checked={
                              selectedAttendance[att.registration_id] === 2
                            }
                            onChange={() =>
                              handleAttendanceChange(att.registration_id, 2)
                            }
                            className="w-4 h-4 rounded-full border-2 border-[#03A1D8] group-hover:cursor-pointer"
                          />
                          <p className="group-hover:cursor-pointer">L</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-300 from-dark-600 justify-end text-surface-100 p-2 rounded-md w-20 my-2 flex justify-center"
        type="submit"
      >
        Submit
      </button>
    </div>
  );
};

export default Table;
