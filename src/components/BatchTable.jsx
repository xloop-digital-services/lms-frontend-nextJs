import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit, FaRegEdit, FaTrash } from "react-icons/fa";
import { createBatch, DeleteBatch, UpdateBatch } from "@/api/route";
import DeleteConfirmationPopup from "./Modal/DeleteConfirmationPopUp";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

const BatchTable = ({
  batches,
  loading,
  setLoading,
  setUpdateBatch,
  updateBatch,
  setConfirmDelete,
  setSelectedBatch,
  selectedBatch,
  confirmDelete
}) => {
  const [edit, setEdit] = useState(false);
 
  const [batch, setbatch] = useState(null);
  const [status, setStatus] = useState(null);
 
  const [updating, setUpdating] = useState(false);
  const [editYear, setEditYear] = useState(null);
  const [editEndDate, setEditEndDate] = useState(null);
  const [editStartDate, setEditStartDate] = useState(null);
  const [editCapacity, setEditCapacity] = useState(null);
  const [error, setError] = useState(false);
  const pathname = usePathname();

  const handleUpdateStatus = (batch) => {
    setSelectedBatch(batch.batch);
    setEditEndDate(batch.end_date);
    setEditStartDate(batch.start_date);
    setEditYear(batch.year);
    setEditCapacity(batch.no_of_students);
    setStatus(batch.status);
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

  const handleUpdate = async () => {
    if (error) {
      toast.error("Capacity must a positive value");
      return;
    }
    if (status === null || updating) return;
    if (editStartDate && editEndDate <= editStartDate) {
      toast.error("End date should be greater than start date");
    } else {
      setLoading(true); // Set updating to true when status is being updated
      try {
        const data = {
          batch: selectedBatch,
          city: batch.city,
          city_abb: batch.city_abb,
          year: editYear,
          no_of_students: editCapacity,
          start_date: editStartDate,
          end_date: editEndDate,
          status: status,
          term: batch.term,
        };

        const response = await UpdateBatch(selectedBatch, data);
        if (response.status === 200) {
          toast.success("Batch updated successfully!");
          console.log("batch updated", response);
          setEdit(false);
          setUpdateBatch(!updateBatch);
        }
      } catch (error) {
        console.log("error while updating status", error);
      } finally {
        setLoading(false); // Set updating to false after the update is complete
      }
    }
  };

  const handleDeleteBatch = async (batch) => {
    setSelectedBatch(batch.batch);
    setConfirmDelete(true);
  };

  

  const handleEndDateChange = (event) => {
    setEditEndDate(event.target.value);
    // Check if end date is earlier than start date
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Check if the value contains invalid characters
    if (/[-]/.test(value)) {
      toast.error("Invalid Value");
      setError(true);
    } else {
      setError(false); // Clear error if no invalid characters are present
      setEditCapacity(value); // Update capacity only when valid
    }
  };

  return (
    <>
      <div className="flex flex-col ">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle max-h-screen overflow-auto scrollbar-webkit">
            <div className=" border border-dark-300 rounded-lg divide-y divide-dark-200 ">
              <div className="overflow-hidden">
                <div
                  className={
                    pathname === "/batch" &&
                    "relative max-h-[75vh] overflow-y-auto scrollbar-webkit"
                  }
                >
                  <table className=" min-w-full divide-y divide-dark-200 dark:divide-gray-700">
                    <thead className="bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 rounded-lg  text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
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
                        <th
                          scope="col"
                          className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                        >
                          Categories
                        </th>
                        <th
                          scope="col"
                          className="px-12 py-4 rounded-lg text-start text-xs font-medium text-gray-500 uppercase w-[20%]"
                        >
                          Status
                        </th>
                        {/* <th
                          scope="col"
                          className="px-6 py-4 rounded-lg text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                        >
                          Actions
                        </th> */}
                      </tr>
                    </thead>
                    {/* {updating && (
                  <div className="absolute inset-0 w-full p-2 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
                    <CircularProgress size={30} />
                  </div>
                )} */}
                    <tbody className="divide-y divide-dark-200 dark:divide-gray-700">
                      {loading && batches.length === 0 ? (
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
                            <tr key={index} className={``}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                {batch.batch || "-"}
                              </td>
                              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {batch.city_id || '-'}
                    </td> */}
                              <td
                                className={` ${
                                  !(edit && selectedBatch === batch.batch)
                                    ? "py-4 px-6"
                                    : "py-1 px-4"
                                } whitespace-nowrap text-sm text-gray-800 dark:text-gray-200`}
                              >
                                {!(edit && selectedBatch === batch.batch) ? (
                                  batch.no_of_students || "-"
                                ) : (
                                  <input
                                    type="number"
                                    value={editCapacity}
                                    onChange={handleInputChange}
                                    className=" px-2 py-3 border border-dark-300 outline-none rounded-lg w-full"
                                    placeholder={batch.no_of_students}
                                    min={0}
                                  />
                                )}
                              </td>
                              <td
                                className={` ${
                                  !(edit && selectedBatch === batch.batch)
                                    ? "py-4 px-6"
                                    : "py-1 px-4"
                                } whitespace-nowrap text-sm text-gray-800 dark:text-gray-200`}
                              >
                                {!(edit && selectedBatch === batch.batch) ? (
                                  batch.start_date || "-"
                                ) : (
                                  <input
                                    type="date"
                                    value={editStartDate}
                                    onChange={(e) =>
                                      setEditStartDate(e.target.value)
                                    }
                                    className=" px-2 py-3 border border-dark-300 outline-none  rounded-lg w-full"
                                    placeholder={batch.start_date}
                                  />
                                )}
                              </td>
                              <td
                                className={` ${
                                  !(edit && selectedBatch === batch.batch)
                                    ? "py-4 px-6"
                                    : "py-1 px-4"
                                } whitespace-nowrap text-sm text-gray-800 dark:text-gray-200`}
                              >
                                {!(edit && selectedBatch === batch.batch) ? (
                                  batch.end_date || "-"
                                ) : (
                                  <input
                                    type="date"
                                    value={editEndDate}
                                    onChange={handleEndDateChange}
                                    className="border border-dark-300  outline-none  px-2 py-3  rounded-lg w-full"
                                    placeholder={batch.end_date}
                                  />
                                )}
                              </td>
                              <td
                                className={` ${
                                  !(edit && selectedBatch === batch.batch)
                                    ? "py-4 px-6"
                                    : "py-1 px-4"
                                } whitespace-nowrap text-sm text-gray-800 dark:text-gray-200`}
                              >
                                {!(edit && selectedBatch === batch.batch) ? (
                                  batch.year || "-"
                                ) : (
                                  <input
                                    type="text"
                                    className=" border border-dark-300 px-2 py-3 outline-none rounded-lg w-full"
                                    value={editYear}
                                    onChange={(e) =>
                                      setEditYear(e.target.value)
                                    }
                                    placeholder={batch.year}
                                  />
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                {
                                  // !(edit && selectedBatch === batch.batch) ? (
                                  batch.term || "-"
                                  // ) : (
                                  //   <input
                                  //   />
                                  // )
                                }
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap flex w-full justify-start items-center text-sm text-surface-100">
                                <p
                                  className={`${
                                    edit && selectedBatch === batch.batch
                                      ? "py-0"
                                      : "py-2"
                                  } ${
                                    batch.status === 1
                                      ? "bg-mix-300"
                                      : "bg-mix-200"
                                  }  w-[100px] text-center text-[12px] rounded-lg `}
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
                                          batch.status === 1
                                            ? "active"
                                            : "inactive"
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
                              {/* <td className="px-8 py-2 whitespace-nowrap text-blue-300 ">
                                <div className="flex gap-4">
                                  <div>
                                    {!(
                                      edit && selectedBatch === batch.batch
                                    ) ? (
                                      <FaEdit
                                        size={20}
                                        className="cursor-pointer hover:opacity-30"
                                        onClick={() =>
                                          handleUpdateStatus(batch)
                                        }
                                        title="update"
                                      />
                                    ) : (
                                      <div className="flex gap-4">
                                        <IoCheckmark
                                          size={20}
                                          title="confirm update"
                                          onClick={handleUpdate}
                                          className="cursor-pointer hover:border-2 border-mix-300 hover:text-mix-300 font-bold rounded-full"
                                        />
                                        <IoClose
                                          size={19}
                                          title="cancel"
                                          onClick={(e) => setEdit(false)}
                                          className="cursor-pointer hover:border-2 border-mix-200 hover:text-mix-200 font-bold rounded-full"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    {!(
                                      edit && selectedBatch === batch.batch
                                    ) && (
                                      <FaTrash
                                        size={20}
                                        className="cursor-pointer hover:opacity-30"
                                        onClick={() => handleDeleteBatch(batch)}
                                        title="delete"
                                      />
                                    )}
                                  </div>
                                </div>
                              </td> */}
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
          </div>
        </div>
      </div>
     
    </>
  );
};

export default BatchTable;