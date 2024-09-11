"use client";
import {
  getAttendanceByCourseId,
  getStudentsByCourseId,
  markAttendanceByCourseId,
} from "@/api/route";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const AdminStudentGrading = ({ courseId }) => {
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
                  </tr>
                </thead>

                <tbody className="divide-y divide-dark-200 dark:divide-gray-700 overflow-y-scroll scrollbar-webkit">
                  {attendance && attendance.length > 0 ? (
                    attendance?.map((att, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                          {att.registration_id}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 hover:text-blue-300">
                          <Link
                            href={`/students/course/${courseId}/student/${att.registration_id}`}
                          >
                            {att.full_name}
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
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
  );
};

export default AdminStudentGrading;
