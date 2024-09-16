import { DeleteBatch, DeleteLocation, UpdateBatch, UpdateLocation } from "@/api/route";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import DeleteConfirmationPopup from "./Modal/DeleteConfirmationPopUp";

const LocationsTable = ({
  locations,
  loading,
  setUpdateLocation,
  updateLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [updating, setUpdating] = useState(false); // Controls the update loading state
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleUpdateStatus = (location) => {
    setSelectedLocation(location.id);
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

  useEffect(() => {
    const handleUpdate = async () => {
      if (status === null || updating) return;

      setUpdating(true); // Set updating to true when status is being updated
      try {
        const data = {
          capacity: location.capacity,
          city: location.city,
          name: location.name,
          shortname: location.shortname,
          status: status,
        };

        const response = await UpdateLocation(selectedLocation, data);
        console.log("location updated", response);
        setEdit(false);
        setUpdateLocation(!updateLocation);
      } catch (error) {
        console.log("error while updating status", error);
      } finally {
        setUpdating(false); // Set updating to false after the update is complete
      }
    };

    handleUpdate();
  }, [status]);

  const handleDeleteLocation = (location) => {
    setSelectedLocation(location.id);
    setConfirmDelete(true)
  };

  const handleDelete = async () => {
    try {
      const response = await DeleteLocation(selectedLocation);
      console.log("deleting the location", response);
      setUpdateLocation(!updateLocation);
      setConfirmDelete(false)
    } catch (error) {
  
      console.log("error while deleting the lcoation", error);
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle ">
          <div className="mt-4 border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden ">
              <table className="min-w-full  divide-y divide-dark-200 dark:divide-gray-700 max-h-screen overflow-auto scrollbar-webkit">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[25%]"
                    >
                      City
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%]"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%]"
                    >
                      Location Code
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%]"
                    >
                      Capacity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%]"
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
                <tbody className="divide-y divide-dark-200 dark:divide-gray-700 ">
                  {loading ? ( // Show loading state while fetching locations
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4 text-dark-400"
                      >
                        <CircularProgress size={20} />
                      </td>
                    </tr>
                  ) : locations && locations.length > 0 ? (
                    locations.map((location, index) => (
                      <tr key={index} className={`${location.status === 2 && 'hidden'}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                          {location.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {location.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {location.shortname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {location.capacity}
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
                          <div className="flex gap-4">
                            <div>
                              <FaEdit
                                size={20}
                                className="cursor-pointer hover:opacity-30"
                                onClick={() => handleUpdateStatus(location)}
                                title="update"
                              />
                            </div>
                            <div>
                              <FaTrash
                                size={20}
                                className="cursor-pointer hover:opacity-30"
                                onClick={() => handleDeleteLocation(location)}
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
        {confirmDelete && (
          <DeleteConfirmationPopup
            setConfirmDelete={setConfirmDelete}
            handleDelete={handleDelete}
            field='location'
          />
        )}
      </div>
    </div>
  );
};

export default LocationsTable;
