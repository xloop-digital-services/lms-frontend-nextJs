import React from "react";
import { formatDateTime } from "./StudentDataStructure";
import { CircularProgress } from "@mui/material";

const StudentAttendence = ({ attendance, loader }) => {
  return (
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
              <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                <thead className="bg-dark-100 dark:bg-gray-700">
                  <tr>
                    {/* <th scope="col" className="py-3 px-4 pe-0">
                      <div className="flex items-center h-5">
                        <input id="hs-table-pagination-checkbox-all" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:Present:bg-blue-500 dark:Checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                        <label for="hs-table-pagination-checkbox-all" className="sr-only">Checkbox</label>
                      </div> 
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[20%]"
                    >
                      Module
                    </th>
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
                          {`Session ${att.session}`}
                        </td>
                        <td className="px-6 py-4 text-center text-wrap whitespace-nowrap text-sm text-gray-800">
                          {att.day}
                        </td>
                        <td className="px-6 py-4 text-center text-wrap whitespace-nowrap text-sm text-gray-800">
                          {formatDateTime(att.date)}
                        </td>
                        <td className="px-12 py-2 whitespace-nowrap flex w-full text-center justify-center items-center text-sm text-surface-100">
                          <p
                            className={`w-[110px] text-center px-4 py-2 text-[12px] rounded-lg ${
                              att.status === "Present"
                                ? "bg-mix-300 w-110px]"
                                : att.status === "Late"
                                ? "bg-mix-500 text-[#fff] w-[110px]"
                                : "bg-mix-200 w-110px]"
                            }`}
                          >
                            {att.status}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
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
  );
};

export default StudentAttendence;
