import { CircularProgress } from "@mui/material";
import React from "react";

const SessionsTable = ({ sessions, loading }) => {
  return (
    <div className="flex flex-col ">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="mt-4 border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-dark-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[24%]"
                    >
                      Batch
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[24%]"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[24%]"
                    >
                      Capacity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[24%]"
                    >
                      Start Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%]"
                    >
                      End Time
                    </th>
                  </tr>
                </thead>
                {/* Set max height and overflow for the table body */}
                <tbody className="divide-y divide-dark-200 max-h-[500px] overflow-y-auto scrollbar-webkit">
                  {loading && sessions.length == 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4 text-dark-400"
                      >
                        <CircularProgress size={20} />
                      </td>
                    </tr>
                  ) : sessions && sessions.length > 0 ? (
                    sessions.map((session, index) => {
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {session.batch}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {session.location_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {session.no_of_students}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {session.start_time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {session.end_time}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 whitespace-nowrap text-sm text-dark-400 dark:text-gray-200 text-center"
                      >
                        No sessions available.
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

export default SessionsTable;
