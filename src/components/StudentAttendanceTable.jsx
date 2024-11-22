"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useAuth } from "@/providers/AuthContext";
import { getUserSessions } from "@/api/route";

export default function StudentAttendanceTable({ loader, attendance }) {
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  // console.log(attendance);

  return (
    <>
      {" "}
      <div className="flex flex-col ">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 ">
              <div className="overflow-hidden rounded-lg">
                <div className="relative max-h-[62vh] overflow-y-auto scrollbar-webkit">
                  <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                    <thead className=" bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
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
                          <td
                            colSpan="8"
                            className="text-center py-4 text-dark-300"
                          >
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
}
