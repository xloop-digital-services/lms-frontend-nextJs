"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import CourseHead from "./CourseHead";
import { useAuth } from "@/providers/AuthContext";
import { getUserSessions } from "@/api/route";

const StudentAttendence = ({ attendance, loader, isAdmin, courseId }) => {
  const { userData } = useAuth();
  // const courseId = params.courseId;
  const isStudent = userData?.Group === "student";
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [studentInstructorName, setStudentInstructorName] = useState(null);

  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoading(true);

    try {
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        console.log(sessions);
        const coursesData = sessions.map((session) => {
          return {
            course: session.course,
            instructorName:
              session.instructor?.instructor_name || "To be Assigned",
          };
        });
        const foundSession = sessions.find(
          (session) => Number(session.course?.id) === Number(courseId)
        );

        if (isStudent && foundSession) {
          setSessionId(foundSession.id);
          setStudentInstructorName(
            foundSession.instructor?.instructor_name || "To be Assigned"
          );
        }
      } else {
        console.error(
          "Failed to fetch user sessions, status:",
          response.status
        );
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessionForUser();
  }, [isStudent]);

  return (
    <>
      <CourseHead
        id={courseId}
        // rating="Top Instructor"
        program="course"
        instructorName={studentInstructorName ? studentInstructorName : ""}
      />

      <div className="flex flex-col ">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
              {/* <div className="py-3 px-4">
              <div className="relative max-w-xs">
              <label className="sr-only">Search</label>
              <input type="text" name="hs-table-with-pagination-search" id="hs-table-with-pagination-search" className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="Search for items" />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                  <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            </div> */}
              <div className="overflow-hidden rounded-lg">
                <div className="relative max-h-[62vh] overflow-y-auto scrollbar-webkit">
                  <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                    <thead className=" bg-[#ffff] text-[#022567] sticky top-0 z-10 shadow-sm shadow-dark-200">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[20%]"
                        >
                          Module
                        </th>
                        {
                          <th
                            scope="col"
                            className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[20%]"
                          >
                            Marked By
                          </th>
                        }
                        <th
                          scope="col"
                          className="px-4  py-4 text-center text-xs font-medium text-gray-500 uppercase w-[20%]"
                        >
                          Day
                        </th>
                        <th
                          scope="col"
                          className="px-4  py-4 text-center text-xs font-medium text-gray-500 uppercase w-[20%]"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[20%]"
                        >
                          Mark
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-200">
                      {loader ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4">
                            <CircularProgress />
                          </td>
                        </tr>
                      ) : attendance && attendance.length > 0 ? (
                        attendance.map((att, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800">
                              {`Day ${index + 1}`}
                            </td>
                            {
                              <td className="px-6 py-4 text-center text-wrap whitespace-nowrap text-sm text-gray-800">
                                {att.marked_by}
                              </td>
                            }
                            <td className="px-6 py-4 text-center text-wrap whitespace-nowrap text-sm text-gray-800">
                              {att.day}
                            </td>
                            <td className="px-6 py-4 text-center text-wrap whitespace-nowrap text-sm text-gray-800">
                              {att.date}
                            </td>
                            <td className="px-12 py-2 whitespace-nowrap flex w-full text-center justify-center items-center text-sm text-surface-100">
                              <p
                                className={`w-[110px] text-center px-4 py-2 text-[12px] rounded-lg ${
                                  att.status === 0
                                    ? "bg-mix-300 w-110px]"
                                    : att.status === "2"
                                    ? "bg-mix-500 text-[#fff] w-[110px]"
                                    : "bg-mix-200 w-110px]"
                                }`}
                              >
                                {att.status === 1
                                  ? "Absent"
                                  : att.status === 0
                                  ? "Present"
                                  : "Leave"}
                              </p>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-4 text-dark-300">
                            No data found
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
    </>
  );
};

export default StudentAttendence;