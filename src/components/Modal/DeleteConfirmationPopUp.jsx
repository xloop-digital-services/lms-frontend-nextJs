"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { CircularProgress } from "@mui/material";

const DeleteConfirmationPopup = ({
  setConfirmDelete,
  handleDelete, // Pass the delete function from parent
  field,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteAction = async () => {
    setLoading(true);
    try {
      await handleDelete(); // Call the passed-in delete function
      setConfirmDelete(false);
      setLoading(false);
    } catch (error) {
      console.log("Error while deleting:", error);
      setLoading(false);
    }
  };

  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className="w-[550px] z-[1000] mx-auto my-20 ">
        {loading ? (
          <div className="absolute inset-0 w-full p-2 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
            <CircularProgress size={30} />
          </div>
        ) : (
          <div className="bg-[#EBF6FF] p-3 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-bold text-xl text-[#07224D]">Confirmation</h1>
              <button className="p-2" onClick={() => setConfirmDelete(false)}>
                <IoClose size={25} />
              </button>
            </div>
            <div className="bg-[#fff] p-4 rounded-2xl text-center">
              <p>Are you sure you want to delete this {field}?</p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  className="border border-blue-300 text-blue-300 rounded-lg px-5 py-2.5 hover:bg-mix-400"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#D84848] text-surface-100 rounded-lg px-5 py-2.5 hover:bg-[#be4141]"
                  onClick={handleDeleteAction}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;