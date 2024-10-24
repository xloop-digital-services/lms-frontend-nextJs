import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import {
  editAssignmentGrading,
  editExamGrading,
  editProjectGrading,
  editQuizGrading,
  updateAssignmentGrading,
  updateExamGrading,
  updateProjectGrading,
  updateQuizGrading,
} from "@/api/route";
import { toast } from "react-toastify";
import { downloadFile } from "@/app/courses/course/[courseId]/page";
import { FaCheck, FaCheckCircle, FaCross, FaEdit } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import { IoCheckmark, IoClose } from "react-icons/io5";

const AdminMarksTable = ({
  assessments,
  courseId,
  setFetch,
  title,
  totalMarks,
}) => {
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(null);
  const [isUpdatingId, setIsUpdatingId] = useState(null);
  const [updatingGrade, setUpdatingGrade] = useState(false);
  const [gradedAssessments, setGradedAssessments] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = (id, assessment) => {
    setIsEditing(id);
    // setUpdatingGrade(true);
    // //console.log(id);
    const data = {
      marks_obtain: assessment?.grade || 0,
      remarks: assessment?.remarks || "-",
    };
    setEditData(data);

    // console.log("Edit Data Set: ", editData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleEditGrading = (id, assessment) => {
    setIsUpdatingId(id);
    setUpdatingGrade(true);
    const data = {
      marks_obtain: assessment?.grade || 0,
      remarks: assessment?.remarks || "-",
    };
    setEditData(data);

    //console.log(id);
  };
  const handleSave = async (id, status) => {
    if (editData.marks_obtain > editData.total_grade) {
      toast.error("Obtained marks are greater than total marks.");
      return;
    }
    try {
      const data = {
        total_grade: editData.total_marks,
        grade: editData.marks_obtain,
        feedback: editData.remarks,
        // assignment: editData.assignment_id,
        registration_id: editData.registration_id,
        // submission: id,
        // submission_id: status === "Submitted" && id ? id : null,
      };

      if (title === "Quiz" && id) {
        data.quiz_submissions = id;
      } else if (title === "Assignment") {
        data.submission = id || null;
      } else if (title === "Exam" && id) {
        data.exam_submission = id;
      } else if (title === "Project" && id) {
        data.project_submissions = id;
      }

      let response;
      if (title === "Quiz") {
        response = await updateQuizGrading(data);
      } else if (title === "Assignment") {
        response = await updateAssignmentGrading(data);
      } else if (title === "Exam") {
        response = await updateExamGrading(data);
      } else if (title === "Project") {
        response = await updateProjectGrading(data);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Graded successfully");
        setFetch(true);
        setIsEditing(null);
        setGradedAssessments((prev) => ({
          ...prev,
          [id]: true,
        }));
      } else {
        toast.error("Error grading the student", response?.message);
      }
    } catch (error) {
      //console.error("Failed to grade", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdateGrade = async (id) => {
    if (editData.marks_obtain > editData.total_grade) {
      toast.error("Obtained marks are greater than total marks.");
      return;
    }
    try {
      const data = {
        total_grade: editData.total_marks,
        grade: editData.marks_obtain,
        feedback: editData.remarks,
        registration_id: editData.registration_id,
      };

      if (title === "Quiz" && id) {
        data.grading_id = id;
      } else if (title === "Assignment") {
        data.grading_id = id || null;
      } else if (title === "Exam" && id) {
        data.grading_id = id;
      } else if (title === "Project" && id) {
        data.grading_id = id;
      }

      let response;
      if (title === "Quiz") {
        response = await editQuizGrading(isUpdatingId, data);
      } else if (title === "Assignment") {
        response = await editAssignmentGrading(isUpdatingId, data);
      } else if (title === "Exam") {
        response = await editExamGrading(isUpdatingId, data);
      } else if (title === "Project") {
        response = await editProjectGrading(isUpdatingId, data);
      }

      if (response.status === 200) {
        toast.success("Grade updated successfully");
        setFetch(true);
        setUpdatingGrade(false);
        setGradedAssessments((prev) => ({
          ...prev,
          [id]: true,
        }));
      } else {
        toast.error(
          `Error grading the student: ${response?.message || "Unknown error"}`
        );
      }
    } catch (error) {
      toast.error(
        `Failed to grade the assessment: ${
          error?.response?.data?.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="flex flex-col cursor-default">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden rounded-lg">
              {loading ? (
                <div className="flex justify-center py-4">
                  <CircularProgress />
                </div>
              ) : (
                <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                  <thead className="bg-surface-100 text-blue-500 shadow-sm shadow-dark-200">
                    <tr>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]">
                        Registration Id
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]">
                        Student Name
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]">
                        Obtained Marks
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]">
                        Remarks
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]">
                        Submitted file
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]">
                        Status
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-200 dark:divide-gray-700">
                    {assessments && assessments.length > 0 ? (
                      assessments.map((assessment, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800">
                            {assessment?.registration_id}
                          </td>
                          <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800">
                            {assessment?.student_name}
                          </td>
                          <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800">
                            {(isEditing === assessment.submission_id ||
                              (updatingGrade &&
                                assessment.grading_id === isUpdatingId)) &&
                            assessment?.status === "Submitted" &&
                            (!assessment?.marks_obtain ||
                              assessment?.marks_obtain === 0) ? (
                              <input
                                type="number"
                                min={0}
                                name="marks_obtain"
                                value={editData.marks_obtain}
                                onChange={handleChange}
                                className="py-3 block text-center w-full outline-none border-b border-dark-500 text-sm focus:border-blue-300 focus:ring-blue-300"
                              />
                            ) : (
                              assessment?.grade || 0
                            )}
                          </td>
                          <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800">
                            {(isEditing === assessment.submission_id ||
                              (updatingGrade &&
                                assessment.grading_id === isUpdatingId)) &&
                            assessment?.status === "Submitted" &&
                            (!assessment?.marks_obtain ||
                              assessment?.marks_obtain === 0) ? (
                              <input
                                type="text"
                                name="remarks"
                                value={editData.remarks}
                                onChange={handleChange}
                                className="py-3 text-center block w-full outline-none border-b border-dark-500 text-sm focus:border-blue-300 focus:ring-blue-300"
                              />
                            ) : (
                              assessment?.remarks || "-"
                            )}
                          </td>
                          <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                            {assessment.submitted_file === null ? (
                              "-"
                            ) : (
                              <a
                                href="#"
                                className="cursor-pointer flex justify-center items-center text-black hover:text-[#2563eb] hover:underline"
                                title="download"
                                onClick={(e) => {
                                  e.preventDefault();
                                  downloadFile(assessment.submitted_file);
                                }}
                              >
                                {assessment.submitted_file.split("/").pop()}
                              </a>
                            )}
                          </td>
                          <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800">
                            <p
                              className={`w-[130px] text-surface-100 text-center px-4 py-2 text-[12px] rounded-lg ${
                                assessment?.status === "Submitted"
                                  ? "bg-mix-300 "
                                  : assessment?.status === "Pending"
                                  ? "bg-mix-500 "
                                  : assessment?.status === "Late Submission"
                                  ? "bg-mix-600 "
                                  : "bg-mix-200 "
                              }`}
                            >
                              {assessment?.status}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800">
                            <div className="flex">
                              {assessment.submitted_file &&
                              assessment.grading_id !== null &&
                              assessment.grading_id > 0 ? (
                                <button className="w-[110px] text-center px-4 py-2 text-[12px] rounded-lg text-sm bg-mix-300 text-surface-200">
                                  Graded
                                </button>
                              ) : assessment?.status !== "Submitted" ? (
                                <button className=" text-center text-[12px] rounded-lg text-sm bg-gray-300 text-blue-300">
                                  You cant grade right now
                                </button>
                              ) : isEditing === assessment.submission_id ? (
                                <button
                                  className="w-[110px] hover:bg-blue-700 text-center px-4 py-2 text-[12px] rounded-lg text-sm bg-blue-300 text-surface-200"
                                  onClick={() =>
                                    handleSave(
                                      assessment.submission_id,
                                      // ||
                                      //   (assessment.assignment &&
                                      //   assessment.registration_id

                                      //     ? assessment.assignment
                                      //     : null),
                                      assessment.status
                                    )
                                  }
                                >
                                  Grade
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleEditClick(
                                      assessment.submission_id,
                                      assessment
                                    )
                                  }
                                  className="w-[110px] text-center px-4 py-2 text-[12px] rounded-lg text-sm bg-blue-300 text-surface-200"
                                >
                                  Grade
                                </button>
                              )}
                              <div>
                                {assessment.grading_id && !updatingGrade && (
                                  <button
                                    title="Edit Grading"
                                    onClick={() =>
                                      handleEditGrading(
                                        assessment.grading_id,
                                        assessment
                                      )
                                    }
                                    className="ml-2 text-center flex items-center justify-center px-4 py-2 text-[12px] rounded-lg text-blue-300"
                                  >
                                    <FaEdit size={18} />
                                  </button>
                                )}

                                {updatingGrade &&
                                  assessment.grading_id === isUpdatingId && (
                                    <div className="flex">
                                      <button
                                        onClick={() =>
                                          handleUpdateGrade(
                                            assessment.grading_id
                                          )
                                        }
                                        className="m-2 flex items-center group text-dark-600"
                                      >
                                        <IoCheckmark
                                          size={20}
                                          title="Confirm update"
                                          className="cursor-pointer hover:border-2 border-mix-300 hover:text-mix-300 font-bold rounded-full"
                                        />
                                      </button>
                                      <button
                                        onClick={() => setUpdatingGrade(false)}
                                        className="m-2 flex items-center group text-dark-600"
                                      >
                                        <IoClose
                                          size={19}
                                          title="Cancel"
                                          className="cursor-pointer hover:border-2 border-mix-200 hover:text-mix-200 font-bold rounded-full"
                                        />
                                      </button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center w-full py-4">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarksTable;
