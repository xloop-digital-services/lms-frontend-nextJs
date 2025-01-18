import { updateWeightages } from "@/api/route";
import React, { useState } from "react";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { sum } from "./CreateWeightage";
import { toast } from "react-toastify";

export default function GetWeightage({
  weigh,
  setUpdateWeightages,
  updateWeight,
}) {
  const [assignmentsWeightage, setAssignmentsWeightage] = useState("");
  const [quizzesWeightage, setQuizzesWeightage] = useState("");
  const [projectsWeightage, setProjectsWeightage] = useState("");
  const [examsWeightage, setExamsWeightage] = useState("");
  const [selectedWeightageId, setSelectedWeightageId] = useState(null);
  const [attenWeightage, setAttenWeightage] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isEditing, setIsEditing] = useState(null);

  async function handleUpdateWeightage() {
    const totalWeightage = sum(
      quizzesWeightage,
      assignmentsWeightage,
      projectsWeightage,
      examsWeightage,
      attenWeightage
    );

    if (totalWeightage !== 100) {
      toast.error("Total weightage must be exactly 100%");
      return;
    }

    const data = {
      course: courseId,
      assignments_weightage: assignmentsWeightage,
      quizzes_weightage: quizzesWeightage,
      projects_weightage: projectsWeightage,
      exams_weightage: examsWeightage,
      attendance_weightage: attenWeightage,
      session: sessionId,
    };

    try {
      if (!sessionId) {
        toast.error("Select a session to assign the weightages.");
        return;
      }
      //console.log(selectedWeightageId);
      const response = await updateWeightages(selectedWeightageId, data);
      if (response.status === 200 || response.status === 201) {
        toast.success(
          "Weightages updated successfully",
          response?.data.message
        );
        setIsEditing(null); 
        setUpdateWeightages(!updateWeight)
      } else {
        toast.error("Error updating weightages", response.data?.message);
      }
    } catch (error) {
      toast.error("Error updating weightages");
    }
  }
  //console.log(selectedWeightageId);
  function handleEditClick(wei) {
    setIsEditing(wei.id);
    setCourseId(wei.course);
    setSessionId(wei.session);
    setSelectedWeightageId(wei.id);
    setAssignmentsWeightage(wei.assignments_weightage);
    setQuizzesWeightage(wei.quizzes_weightage);
    setProjectsWeightage(wei.projects_weightage);
    setExamsWeightage(wei.exams_weightage);
    setAttenWeightage(wei.attendance_weightage);
  }

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                <thead className="bg-surface-100 text-blue-500 shadow-sm shadow-dark-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                    >
                      Component
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                    >
                      Weightage
                    </th>
                  </tr>
                </thead>

                {weigh?.map((wei) => (
                  <tbody
                    key={wei.id}
                    className="divide-y divide-dark-200 dark:divide-gray-700"
                  >
                    <tr>
                      <td className="px-6 py-4 mt-2 text-center whitespace-nowrap text-sm font-medium text-gray-800">
                        Assignments
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {isEditing === wei.id ? (
                          <input
                            type="number"
                            className="focus:outline-none border-b  border-dark-300 text-center"
                            min={0}
                            value={assignmentsWeightage}
                            onChange={(e) =>
                              setAssignmentsWeightage(e.target.value)
                            }
                          />
                        ) : (
                          `${wei.assignments_weightage}%`
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 py-4 mt-2 text-center whitespace-nowrap text-sm font-medium text-gray-800">
                        Quizzes
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {isEditing === wei.id ? (
                          <input
                            type="number"
                            className="focus:outline-none border-b border-dark-300 text-center"
                            min={0}
                            value={quizzesWeightage}
                            onChange={(e) =>
                              setQuizzesWeightage(e.target.value)
                            }
                          />
                        ) : (
                          `${wei.quizzes_weightage}%`
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 py-4 mt-2 text-center whitespace-nowrap text-sm font-medium text-gray-800">
                        Projects
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {isEditing === wei.id ? (
                          <input
                            type="number"
                            min={0}
                            className="focus:outline-none border-b border-dark-300 text-center"
                            value={projectsWeightage}
                            onChange={(e) =>
                              setProjectsWeightage(e.target.value)
                            }
                          />
                        ) : (
                          `${wei.projects_weightage}%`
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 py-4 mt-2 text-center whitespace-nowrap text-sm font-medium text-gray-800">
                        Exam
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {isEditing === wei.id ? (
                          <input
                            type="number"
                            className="focus:outline-none border-b  border-dark-300 text-center"
                            min={0}
                            value={examsWeightage}
                            onChange={(e) => setExamsWeightage(e.target.value)}
                          />
                        ) : (
                          `${wei.exams_weightage}%`
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 mt-2 text-center whitespace-nowrap text-sm font-medium text-gray-800">
                        Attendance
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {isEditing === wei.id ? (
                          <input
                            type="number"
                            className="focus:outline-none border-b  border-dark-300 text-center"
                            min={0}
                            value={attenWeightage}
                            onChange={(e) => setAttenWeightage(e.target.value)}
                          />
                        ) : (
                          `${wei.attendance_weightage}%`
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-center">
                        Total
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {isEditing === wei.id ? (
                          <span>
                            {Number(quizzesWeightage) +
                              Number(assignmentsWeightage) +
                              Number(projectsWeightage) +
                              Number(examsWeightage) +
                              Number(attenWeightage)}{" "}
                            %
                          </span>
                        ) : (
                          `${
                            (Number(wei.assignments_weightage) || 0) +
                            (Number(wei.quizzes_weightage) || 0) +
                            (Number(wei.projects_weightage) || 0) +
                            (Number(wei.exams_weightage) || 0) +
                            (Number(wei.attendance_weightage) || 0)
                          }%`
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-6 py-4 flex gap-2 text-center">
                        {isEditing === wei.id ? (
                          <>
                            <button
                              onClick={() => setIsEditing(null)}
                              className="flex justify-center items-center bg-blue-300 hover:bg-[#3272b6] text-surface-100 p-2 rounded-md w-48 my-2"
                            >
                              <FaTrash className="mr-2" />
                              Cancel Edit
                            </button>
                            <button
                              title="Edit weightages"
                              onClick={handleUpdateWeightage}
                              className="flex justify-center items-center bg-blue-300 hover:bg-[#3272b6] text-surface-100 p-2 rounded-md w-48 my-2"
                            >
                              <FaCheck className="mr-2" />
                              Update weightages
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditClick(wei)}
                            className="flex justify-center items-center bg-blue-300 hover:bg-[#3272b6] text-surface-100 p-2 rounded-md w-48 my-2"
                          >
                            <FaEdit className="mr-2" />
                            Edit weightages
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
