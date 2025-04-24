"use client"
import { hideGradingfromStudentsPerAssignment, hideGradingfromStudentsPerExam, hideGradingfromStudentsPerProject, hideGradingfromStudentsPerQuiz } from '@/api/route';
import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';

export default function HideGradingConfimationModal({ onClose, sessionId, selected, assessments, title }) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [hideGrading, setHideGrading] = useState();
    const [loading, setLoading] = useState(false);
    const confirmHideGrading = () => {
        hideGradeofAssessment();
        setShowConfirmation(false);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);


    async function hideGradeofAssessment() {
        setLoading(true);
        const updatedFlag = !hideGrading;

        let response;

        try {
            if (title === "Quiz") {
                response = await hideGradingfromStudentsPerQuiz(sessionId, selected, {
                    grading_flag: updatedFlag,
                });
            } else if (title === "Assignment") {
                response = await hideGradingfromStudentsPerAssignment(sessionId, selected, {
                    grading_flag: updatedFlag,
                });
            } else if (title === "Exam") {
                response = await hideGradingfromStudentsPerExam(sessionId, selected, {
                    grading_flag: updatedFlag,
                });
            } else if (title === "Project") {
                response = await hideGradingfromStudentsPerProject(sessionId, selected, {
                    grading_flag: updatedFlag,
                });
            }

            if (response && response.status === 200) {
                setHideGrading(updatedFlag);
                onClose()
                toast.success(`Grading ${updatedFlag ? "shown" : "hidden"} successfully!`);
            } else {
                toast.error("Failed to update grading status.");
                onClose()
            }
        } catch (error) {
            toast.error("Error updating grading status.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="backDropOverlay fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-hidden">
            <div className="bg-[#EBF6FF] w-full max-w-[600px] mx-4 p-3 rounded-2xl relative">
                {loading ? (
                    <div className="absolute inset-0 w-full p-2 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
                        <CircularProgress size={30} />
                    </div>
                ) : (
                    <div className="bg-[#EBF6FF] p-3 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="font-bold text-xl font-exo text-blue-500">Confirmation</h1>
                            <button className="p-2" onClick={onClose}>
                                <IoClose size={25} />
                            </button>
                        </div>
                        <div className="bg-surface-100 p-4 rounded-2xl text-center">
                            <p className="text-sm mb-2">Are you sure you want to change grading visibility?</p>
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    className="border border-blue-300 text-blue-300 rounded-lg px-5 py-2.5 hover:bg-mix-400"
                                    onClick={confirmHideGrading}
                                >
                                    Yes
                                </button>
                                <button
                                    className="bg-blue-300 text-surface-100 rounded-lg px-5 py-2.5 hover:bg-[#2670be]"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

