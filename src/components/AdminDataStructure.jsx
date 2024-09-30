import React, { useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import UplaodingFile from "./Modal/UplaodingFile";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { downloadFile } from "@/app/courses/course/[courseId]/page";
import { useAuth } from "@/providers/AuthContext";
import DeleteConfirmationPopup from "./Modal/DeleteConfirmationPopUp";

export function formatDateTime(apiDateTime) {
  const dateObject = new Date(apiDateTime);

  const day = String(dateObject.getUTCDate()).padStart(2, "0");
  const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
  const year = dateObject.getUTCFullYear();

  let hours = dateObject.getUTCHours();
  const minutes = String(dateObject.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = String(hours).padStart(2, "0");

  const formattedDate = `${day}-${month}-${year}`;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return `${formattedDate} ${formattedTime}`;
}

const AdminDataStructure = ({
  quizzes,
  field,
  assessment,
  assessmentNumber,
  onUpdateQuiz,
  dueDate,
  status,
  remarks,
  setQuizzes,
  setUpdateStatus,
  onDelete,
}) => {
  const [uploadFile, setUploadFile] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const { userData } = useAuth();
  const isAdmin = userData?.Group === "admin";
  const isStudent = userData?.Group === "student";
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const handleFileUpload = (id) => {
    setUploadFile(id);
  };

  const handleSave = (quizId) => {
    if (onUpdateQuiz) {
      onUpdateQuiz(quizId, editContent);
    }
    setEditId(null);
  };

  const handleDeleteClick = (quizId) => {
    setSelectedQuiz(quizId);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete(selectedQuiz);
        setConfirmDelete(false);
      }
    } catch (error) {
      console.error("Error deleting the quiz", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col ">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
              <div className="overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                  <thead className="bg-dark-100 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[25%]"
                      >
                        {assessment}
                      </th>
                      {isStudent && (
                        <th
                          scope="col"
                          className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                        >
                          Status
                        </th>
                      )}
                      <th
                        scope="col"
                        className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        Created Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        Total Marks
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        Due Date
                      </th>
                      {assessment === "Exam" && (
                        <>
                          <th
                            scope="col"
                            className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                          >
                            Start Time
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                          >
                            End Time
                          </th>
                        </>
                      )}
                      {isStudent && (
                        <th
                          scope="col"
                          className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                        >
                          Submission Date
                        </th>
                      )}{" "}
                      {field === "exam" ? null : (
                        <>
                          <th
                            scope="col"
                            className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                          >
                            Resubmissions allowed
                          </th>
                          {/*                        
                         <th
                         scope="col"
                         className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                       >
                         Resubmissions Left
                       </th> */}
                        </>
                      )}{" "}
                      <th
                        scope="col"
                        className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-dark-200 dark:divide-gray-700">
                    {quizzes && quizzes.length > 0 ? (
                      quizzes?.map((quiz, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                            {/* {editId === quiz.id ? (
                              <input
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="border px-2 py-1"
                              />
                            ) : ( */}
                            <a
                              href="#"
                              className="cursor-pointer flex justify-center items-center text-black hover:text-[#2563eb] hover:underline"
                              title="download"
                              onClick={(e) => {
                                e.preventDefault();
                                downloadFile(quiz.content);
                              }}
                            >
                              {quiz.question || quiz.title}
                            </a>
                            {/* )} */}
                          </td>
                          {isStudent && (
                            <td className="px-12 py-2  whitespace-nowrap text-sm text-surface-100">
                              <p
                                className={`w-[110px] text-center px-4 py-2 text-[12px] rounded-lg ${
                                  quiz?.submission_status === "Submitted"
                                    ? "bg-mix-300 w-110px]"
                                    : quiz?.submission_status === "Pending"
                                    ? "bg-mix-500 text-[#fff] w-[110px]"
                                    : "bg-mix-200 w-110px]"
                                }`}
                              >
                                {quiz?.submission_status}
                              </p>
                            </td>
                          )}
                          <td className="px-6 py-4  text-center whitespace-nowrap text-sm text-gray-800">
                            {formatDateTime(quiz?.created_at)}
                          </td>
                          <td className="px-6 py-4  text-center whitespace-nowrap text-sm text-gray-800">
                            {quiz?.total_grade || "-"}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {formatDateTime(quiz?.due_date)}
                          </td>
                          {assessment === "Exam" && (
                            <>
                              <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                                {quiz?.start_time}
                              </td>
                              <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                                {quiz?.end_time}
                              </td>
                            </>
                          )}
                          {isStudent && (
                            <td className="px-6 py-4  text-center whitespace-nowrap text-sm text-gray-800">
                              {quiz?.submitted_at
                                ? formatDateTime(quiz?.submitted_at)
                                : "-"}
                            </td>
                          )}{" "}
                          {field === "exam" ? null : (
                            //  : edit ? (
                            //   <th
                            //     scope="col"
                            //     className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                            //   >

                            //     <input
                            //       type="number"
                            //       min={0}
                            //       className="block w-20 outline-dark-300 p-4 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                            //       // value={resubmission}
                            //       // onChange={(e) => setResubmission(e.target.value)}
                            //     />
                            //   </th>
                            // ) :
                            <>
                              <th
                                scope="col"
                                className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                              >
                                {quiz?.no_of_resubmissions_allowed}
                              </th>
                              {/* <th
                                scope="col"
                                className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                              >
                                {quiz?.remaining_resubmissions}
                              </th> */}
                            </>
                          )}
                          <th
                            scope="col"
                            className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                          >
                            {quiz.status === 0
                              ? "Inactive"
                              : quiz.status === 1
                              ? "active"
                              : "-"}
                          </th>
                          <td className="px-12 py-3 whitespace-nowrap text-[#03A1D8]  ">
                            <div className="flex items-center justify-center gap-4">
                              {/* <MdRemoveRedEye
                                title="view"
                                className="cursor-pointer"
                                size={23}
                              /> */}

                              {/* {isAdmin ? null : (
                                <LuUpload
                                  size={20}
                                  onClick={() => handleFileUpload(quiz?.id)}
                                  className="cursor-pointer hover:opacity-80"
                                  title="upload"
                                />
                              )} */}

                              {editId === quiz.id ? (
                                <></>
                              ) : (
                                // <FaEdit
                                //   size={20}
                                //   title="Save"
                                //   onClick={() => handleSave(quiz.id)}
                                //   className="cursor-pointer hover:opacity-80"
                                // />
                                // <></>
                                <>
                                  <FaEdit
                                    title="edit"
                                    className="cursor-pointer"
                                    onClick={() => handleSave(quiz.id)}
                                  />

                                  <FaTrash
                                    title="Delete"
                                    className="cursor-pointer"
                                    onClick={() => handleDeleteClick(quiz.id)}
                                  />
                                </>
                              )}

                              {/* <FaTrash
                                  title="delete"
                                  className="cursor-pointer"
                                /> */}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No data found
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

      {uploadFile && (
        <UplaodingFile
          field={field}
          heading={assessment}
          setUploadFile={setUploadFile}
          assignmentID={iD}
          setUpdateStatus={setUpdateStatus}
        />
      )}
      {confirmDelete && (
        <DeleteConfirmationPopup
          setConfirmDelete={setConfirmDelete}
          handleDelete={handleDelete}
          field={field}
        />
      )}
    </div>
  );
};

export default AdminDataStructure;
