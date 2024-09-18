import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit, FaRegEdit, FaTrash } from "react-icons/fa";
import { createBatch, DeleteBatch, UpdateBatch } from "@/api/route";
import DeleteConfirmationPopup from "./Modal/DeleteConfirmationPopUp";

const BatchTable = ({ batches, loading, setUpdateBatch, updateBatch }) => {
  const [edit, setEdit] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batch, setbatch] = useState(null);
  const [status, setStatus] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleUpdateStatus = (batch) => {
    setSelectedBatch(batch.batch);
    setbatch(batch);
    // console.log("fhsfldddeeeeeeeeeeeewwwwww", batch.batch);
    setEdit(!edit);
  };

  const handleSetStatus = (status) => {
    if (status === "active") {
      setStatus(1);
    } else {
      setStatus(0);
    }
  };

  useEffect(() => {
    const handleUpdate = async () => {
      if (status === null || updating) return;

      setUpdating(true); // Set updating to true when status is being updated
      try {
        const data = {
          batch: selectedBatch,
          city: batch.city,
          city_abb: batch.city_abb,
          year: batch.year,
          no_of_students: batch.no_of_students,
          start_date: batch.start_date,
          end_date: batch.end_date,
          status: status,
          term: batch.term,
        };

        const response = await UpdateBatch(selectedBatch, data);
        console.log("batch updated", response);
        setEdit(false);
        setUpdateBatch(!updateBatch);
      } catch (error) {
        console.log("error while updating status", error);
      } finally {
        setUpdating(false); // Set updating to false after the update is complete
      }
    };
    handleUpdate();
  }, [status]);

  const handleDeleteBatch = async (batch) => {
    setSelectedBatch(batch.batch);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      const response = await DeleteBatch(selectedBatch);
      console.log("deleting the batch", response);
      setUpdateBatch(!updateBatch);
      setConfirmDelete(false);
    } catch (error) {
      console.log("error while deleting the batch", error);
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle max-h-screen overflow-auto scrollbar-webkit">
          <div className="mt-4 border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden">
              <table className=" min-w-full divide-y divide-dark-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                    >
                      Batch Name
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                    >
                      Area
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[16%]"
                    >
                      Capacity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                    >
                      Start Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                    >
                      End Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                    >
                      year
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                    >
                      Categories
                    </th> */}
                    <th
                      scope="col"
                      className="px-12 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%]"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                {updating && (
                  <div className="absolute inset-0 w-full p-2 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
                    <CircularProgress size={30} />
                  </div>
                )}
                <tbody className="divide-y divide-dark-200 dark:divide-gray-700">
                  {loading && batches.length == 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4 text-dark-400"
                      >
                        <CircularProgress size={20} />
                      </td>
                    </tr>
                  ) : batches && batches.length > 0 ? (
                    batches
                      .sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at)
                      )
                      .map((batch, index) => (
                        <tr
                          key={index}
                          className={`${batch.status === 2 && "hidden"}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                            {batch.batch || "-"}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {batch.city_id || '-'}
                    </td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {batch.no_of_students || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {batch.start_date || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {batch.end_date || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {batch.year || "-"}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      Winter
                    </td> */}
                          <td className="px-6 py-2 whitespace-nowrap flex w-full justify-start items-center text-sm text-surface-100">
                            <p
                              className={`${
                                edit && selectedBatch === batch.batch
                                  ? "py-0"
                                  : "py-2"
                              } ${
                                batch.status === 1
                                  ? "bg-[#18A07A]"
                                  : "bg-[#D84848]"
                              }  w-[100px] text-center text-[12px] rounded-lg`}
                            >
                              {!(edit && selectedBatch === batch.batch) ? ( // Check if the current index is selected for editing
                                (batch.status === 1 && "Active") ||
                                (batch.status === 0 && "Inactive")
                              ) : (
                                <th
                                  scope="col"
                                  className=" text-center p-1 text-xs font-medium  text-gray-500 uppercase "
                                >
                                  <select
                                    className="bg-dark-300 bg-opacity-0 block p-2 w-full  border border-dark-200 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-[#1e785e] transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                    defaultValue={
                                      batch.status === 1 ? "active" : "inactive"
                                    }
                                    onChange={(e) =>
                                      handleSetStatus(e.target.value)
                                    } // Handle status change here
                                  >
                                    <option
                                      value="active"
                                      className="py-2 text-dark-900"
                                    >
                                      Active
                                    </option>
                                    <option
                                      value="inactive"
                                      className="py-2 text-dark-900"
                                    >
                                      Inactive
                                    </option>
                                  </select>
                                </th>
                              )}
                            </p>
                          </td>
                          <td className="px-8 py-2 whitespace-nowrap text-[#03A1D8] ">
                            <div className="flex gap-4">
                              <div>
                                <FaEdit
                                  size={20}
                                  className="cursor-pointer hover:opacity-30"
                                  onClick={() => handleUpdateStatus(batch)}
                                  title="update"
                                />
                              </div>
                              <div>
                                <FaTrash
                                  size={20}
                                  className="cursor-pointer hover:opacity-30"
                                  onClick={() => handleDeleteBatch(batch)}
                                  title="delete"
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-4 whitespace-nowrap text-sm text-dark-400 dark:text-gray-200 text-center"
                      >
                        No batch found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {confirmDelete && (
          <DeleteConfirmationPopup
            setConfirmDelete={setConfirmDelete}
            handleDelete={handleDelete}
            field="batch"
          />
        )}
      </div>
    </div>
  );
};

export default BatchTable;
