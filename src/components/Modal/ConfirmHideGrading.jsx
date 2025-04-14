"use client";
import CircularProgress from "@mui/material/CircularProgress";
import { IoClose } from "react-icons/io5";

const ConfirmHideGrading = ({ isOpen, onClose, onConfirm, loading }) => {

 const handleHideGradings = async (sessionId, flag) => {
   try {
     const response = await hideGradingfromStudents(sessionId,flag);

     if (response.status === 200) {
       toast.success("Grading hidden successfully!");
     } else {
       toast.error("Error hiding grading", response?.message);
     }
   } catch (error) {
     toast.error("Error hiding grading", error);
   }
 };

  if (!isOpen) return null;

  return (
    <div className="backDropOverlay h-screen flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-[1000]">
      <div className="w-[650px] z-[1100] bg-white p-6 rounded-md">
        {loading ? (
          <div className="w-full p-2 flex items-center justify-center">
            <CircularProgress size={30} />
          </div>
        ) : (
          <div>
            <div className="bg-[#EBF6FF] p-3 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-xl capitalize font-exo text-blue-500">
                  Confirm Hide Grading
                </h1>
                <button className="p-2" onClick={onClose}>
                  <IoClose size={25} />
                </button>
              </div>
              <div className="bg-surface-100 p-4 rounded-2xl text-center">
                <p className="text-blue-300 mb-4">
                  Are you sure you want to hide the grading from the students?
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 border border-blue-200 text-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="px-6 py-2 rounded-md text-surface-100 hover:bg-blue-300 text-white bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmHideGrading;
