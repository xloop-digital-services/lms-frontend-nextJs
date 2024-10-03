import { DeleteLocation, UpdateLocation } from "@/api/route";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import DeleteConfirmationPopup from "./Modal/DeleteConfirmationPopUp";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const LocationsTable = ({
  locations,
  loading,
  setLoading,
  setUpdateLocation,
  updateLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [updating, setUpdating] = useState(false); // Controls the update loading state
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editCapacity, setEditCapacity] = useState(null);
  const [error, setError] = useState(false);

  const handleUpdateStatus = (location) => {
    setEditCapacity(location.capacity);
    setSelectedLocation(location.id);
    setStatus(location.status);
    setLocation(location);
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
      toast.error(" Capacity must a positive value");
      return;
    }
    if (status === null || updating) return;
    setLoading(true); // Set updating to true when status is being updated
    try {
      const data = {
        capacity: editCapacity,
        city: location.city,
        name: location.name,
        shortname: location.shortname,
        status: status,
      };

      const response = await UpdateLocation(selectedLocation, data);
      // if (response.status === 200){
      //   toast.success(response.data.message);
      // }
      // console.log("location updated", response);
      toast.success("Location updated successfully");
      setEdit(false);
      setUpdateLocation(!updateLocation);
    } catch (error) {
      console.log("error while updating status", error);
    } finally {
      setLoading(false); // Set updating to false after the update is complete
    }
  };

  const handleDeleteLocation = (location) => {
    setSelectedLocation(location.id);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await DeleteLocation(selectedLocation);
      if (response.status === 204) {
        toast.success("Location deleted successfully! ");
        setUpdateLocation(!updateLocation);
        setConfirmDelete(false);
      }
      console.log("deleting the location", response);
    } catch (error) {
      console.log("error while deleting the lcoation", error);
    } finally {
      setLoading(false);
    }
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
    <div className="flex flex-col ">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle ">
          <div className="mt-4 border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden ">
              <div className="relative max-h-[75vh] overflow-y-auto scrollbar-webkit">
                <table className="min-w-full divide-y divide-dark-200">
                  <thead className="bg-[#ffff]  sticky top-0 z-10 shadow-sm shadow-dark-200">
                    <tr>
                      <th className="px-6 py-4 rounded-lg text-start text-xs font-medium text-gray-500 uppercase w-[25%] bg-gray-50 dark:bg-gray-700">
                        City
                      </th>
                      <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%] bg-gray-50 dark:bg-gray-700">
                        Location
                      </th>
                      <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%] bg-gray-50 dark:bg-gray-700">
                        Location Code
                      </th>
                      <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%] bg-gray-50 dark:bg-gray-700">
                        Capacity
                      </th>
                      <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%] bg-gray-50 dark:bg-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 rounded-lg text-start text-xs font-medium text-gray-500 uppercase w-[18%] bg-gray-50 dark:bg-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-dark-200 max-h-[500px] overflow-y-auto scrollbar-webkit ">
                    {loading && locations.length === 0 ? ( // Show loading state while fetching locations
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-4 text-dark-400"
                        >
                          <CircularProgress size={20} />
                        </td>
                      </tr>
                    ) : locations && locations.length > 0 ? (
                      locations
                        .sort(
                          (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at)
                        )
                        .map((location, index) => (
                          <tr key={index} className={``}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                              {location.city}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              {location.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              {location.shortname}
                            </td>
                            <td
                              className={`${
                                !(edit && selectedLocation === location.id)
                                  ? "py-4 px-6"
                                  : "py-1 px-4"
                              }  whitespace-nowrap text-sm text-gray-800 dark:text-gray-200`}
                            >
                              {!(edit && selectedLocation === location.id) ? (
                                location.capacity
                              ) : (
                                <input
                                  type="number"
                                  className="border border-dark-300 text-[#424b55] outline-none p-3 rounded-lg w-full"
                                  placeholder={location.capacity}
                                  value={editCapacity}
                                  min={0}
                                  onChange={handleInputChange}
                                />
                              )}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap flex w-full justify-start items-center text-sm text-surface-100">
                              <p
                                className={`${
                                  edit && selectedLocation === location.id
                                    ? "py-0"
                                    : "py-2"
                                } ${
                                  location.status === 1
                                    ? "bg-[#18A07A]"
                                    : "bg-[#D84848]"
                                }  w-[100px] text-center text-[12px] rounded-lg`}
                              >
                                {!(edit && selectedLocation === location.id) ? ( // Check if the current index is selected for editing
                                  (location.status === 1 && "Active") ||
                                  (location.status === 0 && "Inactive")
                                ) : (
                                  <th
                                    scope="col"
                                    className=" text-center p-1 text-xs font-medium  text-gray-500 uppercase "
                                  >
                                    <select
                                      className="bg-dark-300 bg-opacity-0 block p-2 w-full  border border-dark-200 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-[#1e785e] transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                      defaultValue={
                                        location.status === 1
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
                            <td className="px-8 py-2 whitespace-nowrap text-[#03A1D8] ">
                              <div className="flex gap-4 justify-center items-center">
                                <div>
                                  {!(
                                    edit && selectedLocation === location.id
                                  ) ? (
                                    <FaEdit
                                      size={20}
                                      className="cursor-pointer hover:opacity-30"
                                      onClick={() =>
                                        handleUpdateStatus(location)
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
                                {/* <div>
                                {!(
                                  edit && selectedLocation === location.id
                                ) && (
                                  <FaTrash
                                    size={20}
                                    className="cursor-pointer hover:opacity-30"
                                    onClick={() =>
                                      handleDeleteLocation(location)
                                    }
                                    title="delete"
                                  />
                                )}
                              </div> */}
                              </div>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 whitespace-nowrap text-sm text-dark-400 dark:text-gray-200 text-center"
                        >
                          No location found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {confirmDelete && (
          <DeleteConfirmationPopup
            setConfirmDelete={setConfirmDelete}
            handleDelete={handleDelete}
            field="location"
          />
        )}
      </div>
    </div>
  );
};

export default LocationsTable;
