import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import {
  updateAssignmentGrading,
  updateExamGrading,
  updateProjectGrading,
  updateQuizGrading,
} from "@/api/route";
import { toast } from "react-toastify";

const AdminMarksTable = ({ assessments, courseId, setFetch, title }) => {
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(null);
  const [gradedAssessments, setGradedAssessments] = useState({}); // Track which assessments are graded

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = (id, assessment) => {
    setIsEditing(id);
    setEditData({
      total_marks: assessment?.total_marks || 0,
      marks_obtain: assessment?.marks_obtain || 0,
      remarks: assessment?.remarks || "-",
      assignment_id: assessment?.assignment || null,
      // registration_id: assessment?.registration_id || null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async (id, status) => {
    try {
      const data = {
        total_grade: editData.total_marks,
        grade: editData.marks_obtain,
        feedback: editData.remarks,
        // assignment: editData.assignment_id,
        registration_id: editData.registration_id,
        submission: id,
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
        setIsEditing(null);
        setFetch(true);
        setGradedAssessments((prev) => ({
          ...prev,
          [id]: true,
        }));
      } else {
        toast.error("Error grading the student", response?.data?.message);
      }
    } catch (error) {
      console.error("Failed to update grading", error);
      toast.error("Failed to grade the assessment");
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
                  <thead className="bg-dark-100 text-[#022567] dark:bg-gray-700">
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
                            {isEditing === assessment.submission_id &&
                            assessment?.status === "Submitted" &&
                            (!assessment?.marks_obtain ||
                              assessment?.marks_obtain === 0) ? (
                              <input
                                type="number"
                                min={0}
                                name="marks_obtain"
                                value={editData.marks_obtain}
                                onChange={handleChange}
                                className="py-3 px-4 block w-full outline-none border-b border-dark-500 text-sm focus:border-blue-300 focus:ring-blue-300"
                              />
                            ) : (
                              assessment?.grade || 0
                            )}
                          </td>
                          <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800">
                            {isEditing === assessment.submission_id &&
                            assessment?.status === "Submitted" &&
                            (!assessment?.marks_obtain ||
                              assessment?.marks_obtain === 0) ? (
                              <input
                                type="text"
                                name="remarks"
                                value={editData.remarks}
                                onChange={handleChange}
                                className="py-3 px-4 block w-full outline-none border-b border-dark-500 text-sm focus:border-blue-300 focus:ring-blue-300"
                              />
                            ) : (
                              assessment?.remarks || "-"
                            )}
                          </td>
                          <td className="px-6 py-4 flex justify-center items-center text-sm font-medium text-surface-100">
                            <p
                              className={`w-[130px] text-center px-4 py-2 text-[12px] rounded-lg ${
                                assessment?.status === "Submitted"
                                  ? "bg-mix-300"
                                  : assessment?.status === "Pending"
                                  ? "bg-mix-500 text-[#fff]"
                                  : assessment?.status === "Late Submission"
                                  ? "bg-mix-600 text-[#fff] "
                                  : "bg-mix-200"
                              }`}
                            >
                              {assessment?.status}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800">
                            {(assessment?.grade > 0 &&
                              assessment.status === "Submitted") ||
                            assessment.status === "Late Submission" ? (
                              <button className="w-[110px] text-center px-4 py-2 text-[12px] rounded-lg text-sm bg-mix-300 text-surface-200">
                                Graded
                              </button>
                            ) : assessment?.status !== "Submitted" ? (
                              <button className=" text-center text-[12px] rounded-lg text-sm bg-gray-300 text-blue-300">
                                You cant grade right now
                              </button>
                            ) : isEditing === assessment.submission_id ? (
                              <button
                                className="w-[110px] text-center px-4 py-2 text-[12px] rounded-lg text-sm bg-blue-300 text-surface-200"
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
                                    // ||
                                    //   (assessment.assignment &&
                                    //   assessment.registration_id
                                    //     ? assessment.assignment
                                    //     : null),
                                    assessment
                                  )
                                }
                                className="w-[110px] text-center px-4 py-2 text-[12px] rounded-lg text-sm bg-blue-300 text-surface-200"
                              >
                                Grade
                              </button>
                            )}
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
