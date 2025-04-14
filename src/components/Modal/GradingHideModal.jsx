"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { CircularProgress } from "@mui/material";

const GradingConfirmationModal = ({
    setConfirmModal,
    handleConfirm,     // Function to toggle grading_flag
    actionType,        // "hide" or "show"
}) => {
    const [loading, setLoading] = useState(false);

    const handleAction = async () => {
        setLoading(true);
        try {
            await handleConfirm();  // Your toggle function
            setConfirmModal(false);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <div className="backDropOverlay h-screen flex justify-center items-center">
            <div className="w-[550px] z-[1000] mx-auto my-20">
                {loading ? (
                    <div className="absolute inset-0 w-full p-2 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
                        <CircularProgress size={30} />
                    </div>
                ) : (
                    <div className="bg-[#EBF6FF] p-3 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="font-bold text-xl font-exo text-blue-500">Confirmation</h1>
                            <button className="p-2" onClick={() => setConfirmModal(false)}>
                                <IoClose size={25} />
                            </button>
                        </div>
                        <div className="bg-surface-100 p-4 rounded-2xl text-center">
                            <p>Are you sure you want to {actionType} student&apos;s grading?</p>
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    className="border border-blue-300 text-blue-300 rounded-lg px-5 py-2.5 hover:bg-mix-400"
                                    onClick={() => setConfirmModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-blue-300 text-surface-100 rounded-lg px-5 py-2.5 hover:bg-[#2670be]"
                                    onClick={handleAction}
                                    disabled={loading}
                                >
                                    {actionType === "hide" ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GradingConfirmationModal;
