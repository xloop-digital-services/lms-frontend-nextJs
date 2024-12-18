import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import UserModal from "./Modal/UserModal";
import { CircularProgress } from "@mui/material";
const DevelopmentTable = ({
  selectedOption,
  setStatusUpdated,
  statusUpdated,
  userByProgramID,
  loading,
  message,
  setModal,
  setSelectedUser,
}) => {

  const handleModal = (user) => {
    setSelectedUser(user); 
    setModal(true);
  };
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 ">
              <div className="overflow-hidden">
                <div className="relative max-h-[500px] overflow-y-auto scrollbar-webkit">
                  <table className="min-w-full divide-y divide-dark-200 ">
                    <thead className="bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
                      <tr>
                        {/* <th scope="col" className="py-3 px-4 pe-0">
                      <div className="flex items-center h-5">
                        <input
                          id="hs-table-pagination-checkbox-all"
                          type="checkbox"
                          className="border-dark-200 rounded text-blue-600 focus:ring-blue-500 "
                        />
                        <label className="sr-only">Checkbox</label>
                      </div>
                    </th> */}
                        <th
                          scope="col"
                          className="px-6 py-4 rounded-lg text-start text-xs font-medium text-gray-500 uppercase w-[16%]"
                        >
                          {selectedOption} Name
                        </th>
                        <th
                          scope="col"
                          className="px-[80px] py-4 text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[14%]"
                        >
                          City
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[14%]"
                        >
                          Year
                        </th>
                        {/* <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                    >
                      Contact No.
                    </th> */}
                        <th
                          scope="col"
                          className="px-14 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[13%]"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 rounded-lg text-center text-xs font-medium text-gray-500 uppercase w-[14%]"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-200 ">
                      {loading ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-4 text-dark-400"
                          >
                            <CircularProgress size={20} />
                          </td>
                        </tr>
                      ) : message ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-4 text-dark-400"
                          >
                            {message}
                          </td>
                        </tr>
                      ) : userByProgramID && userByProgramID.length > 0 ? (
                        userByProgramID
                          .sort(
                            (a, b) =>
                              new Date(b.created_at) - new Date(a.created_at)
                          )
                          .map((user, index) => (
                            <tr key={index}>
                              {/* <td className="py-3 ps-4">
                          <div className="flex items-center h-5">
                            <input
                              id="hs-table-pagination-checkbox-1"
                              type="checkbox"
                              className="border-dark-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-dark-800 dark:border-dark-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-dark-800"
                            />
                            <label className="sr-only">Checkbox</label>
                          </div>
                        </td> */}
                              <td className="px-6 whitespace-nowrap text-sm text-gray-800 ">
                                <div className="flex items-center gap-3">
                                  <div className="data">
                                    <p className="font-normal text-sm text-dark-900 capitalize">
                                      {user?.first_name} {user?.last_name}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 ">
                                {user?.email || "-"}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 ">
                                {user?.city || "-"}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 ">
                                {user?.year || "-"}
                              </td>
                              {/* <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 ">
                          {user?.contact || '-'}
                        </td> */}
                              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800 ">
                                <div className=" whitespace-nowrap flex w-full justify-start text-sm text-surface-100  ">
                                  <p
                                    className={`${
                                      user?.application_status === "pending"
                                        ? "bg-mix-500"
                                        : user?.application_status ===
                                          "short_listed"
                                        ? " bg-blue-300 "
                                        : user?.account_status === "verified"
                                        ? "bg-mix-300"
                                        : "bg-mix-200 "
                                    }  w-[120px] text-center px-4 py-2 rounded-lg capitalize`}
                                  >
                                    {user?.application_status === "approved"
                                      ? user?.account_status
                                      : user?.application_status ===
                                        "short_listed"
                                      ? "shortlisted"
                                      : user?.application_status}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap t text-sm font-medium flex space-x-2">
                                <div
                                  className="flex items-center justify-center w-full group text-blue-300"
                                  title="info"
                                  onClick={() => handleModal(user)} 
                                >
                                  <FaEye
                                    size={23}
                                    className="group-hover:text-blue-400"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-4 text-dark-400"
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
};
export default DevelopmentTable;