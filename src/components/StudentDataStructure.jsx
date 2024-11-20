import React, { useState } from "react";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { MdRemoveRedEye } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import UplaodingFile from "./Modal/UplaodingFile";
import { FaCheck, FaEdit, FaFileDownload, FaTrash } from "react-icons/fa";
import { downloadFile } from "@/app/courses/course/[courseId]/page";
import { useAuth } from "@/providers/AuthContext";
import { formatDateTime } from "./AdminDataStructure";
import ResubmissionModal from "./Modal/ResubmissionModal";
import { FaFile } from "react-icons/fa6";
import AssessmentDescModal from "./Modal/AssessmentDescModal";

const StudentDataStructure = ({
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
  studentInstructorID,
}) => {
  const [uploadFile, setUploadFile] = useState(false);
  const [resubmitFile, setResubmitFile] = useState(false);
  const [edit, setEdit] = useState(false);
  const [iD, setId] = useState("");
  const [resubmissionId, setResubmissionId] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [description, setDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();
  const isAdmin = userData?.Group === "admin";

  const handleOpenModal = (quiz) => {
    setSelectedQuiz(quiz);
    setDescription(true);
  };

  const handleCloseModal = () => {
    setDescription(false);
    setSelectedQuiz(null);
  };

  const handleFileUpload = (id) => {
    setId(id);
    setUploadFile(!uploadFile);
  };

  const handleFileResubmit = (id, subId) => {
    setId(id);
    setResubmissionId(subId);
    setResubmitFile(!resubmitFile);
    //console.log("quiz id", id, "submission Id", subId);
  };

  const handleEditAssessment = (id) => {
    setId(id);
    setEdit(!edit);
  };
  const handleQuestionChange = (id, newQuestion) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) =>
        quiz.id === id ? { ...quiz, question: newQuestion } : quiz
      )
    );
  };

  return (
    <div>
      <div className="flex flex-col ">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 ">
              {/* <div className="py-3 px-4">
              <div className="relative max-w-xs">
                <label className="sr-only">Search</label>
                <input type="text" name="hs-table-with-pagination-search" id="hs-table-with-pagination-search" className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="Search for items" />
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                  <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            </div> */}
              <div className="overflow-hidden rounded-lg">
                <div className="relative max-h-[56vh] overflow-y-auto scrollbar-webkit">
                  <table className="min-w-full divide-y divide-dark-300 ">
                    <thead className=" bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[25%]"
                        >
                          {assessment}
                        </th>

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

                        <th
                          scope="col"
                          className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                        >
                          Submission Date
                        </th>
                        {field === "exam" ? null : (
                          <>
                            <th
                              scope="col"
                              className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                            >
                              Resubmissions allowed
                            </th>

                            <th
                              scope="col"
                              className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                            >
                              Resubmissions Left
                            </th>
                          </>
                        )}
                        {isAdmin ? (
                          <th
                            scope="col"
                            className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                          >
                            Status
                          </th>
                        ) : null}
                        <th
                          scope="col"
                          className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
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
                        quizzes?.map((quiz, index) => {
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                                {edit && iD === quiz.id ? (
                                  <>
                                    <th
                                      scope="col"
                                      className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                                    >
                                      <textarea
                                        rows="2"
                                        className="block outline-dark-300 p-4 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                                        value={quiz.question || quiz.title}
                                        onChange={(e) =>
                                          handleQuestionChange(
                                            quiz.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </th>
                                  </>
                                ) : (
                                  <>
                                    {quiz.content === null ? (
                                      quiz.question || quiz.title
                                    ) : (
                                      <a
                                        href="#"
                                        className="cursor-pointer flex justify-center items-center text-black hover:text-[#2563eb] hover:underline"
                                        title="Download Assessment file"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          downloadFile(quiz.content);
                                        }}
                                      >
                                        {quiz.question || quiz.title}
                                        {/* {quiz.assignment_name} */}
                                      </a>
                                    )}
                                  </>
                                )}
                              </td>

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
                              <td className="px-6 py-4  text-center whitespace-nowrap text-sm text-gray-800">
                                {quiz?.submitted_at
                                  ? formatDateTime(quiz?.submitted_at)
                                  : "-"}
                              </td>

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
                                  <th
                                    scope="col"
                                    className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                                  >
                                    {quiz?.remaining_resubmissions}
                                  </th>
                                </>
                              )}
                              {isAdmin && !edit ? (
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
                              ) : isAdmin && edit ? (
                                <>
                                  <th
                                    scope="col"
                                    className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                                  >
                                    <select className=" bg-surface-100 block p-2 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                                      <option value="active">Active</option>
                                      <option>Inactive</option>
                                    </select>
                                  </th>
                                </>
                              ) : null}
                              <td className=" py-2  whitespace-nowrap text-sm text-surface-100">
                                <p
                                  className={`w-[120px] text-center px-4 py-2 text-[12px] rounded-lg ${
                                    quiz?.submission_status === "Submitted"
                                      ? "bg-mix-300 w-[120px]"
                                      : quiz?.submission_status === "Pending"
                                      ? "bg-mix-500 text-[#fff] w-[120px]"
                                      : quiz?.submission_status ===
                                        "Late Submission"
                                      ? "bg-mix-600 text-[#fff] w-[110px]"
                                      : "bg-mix-200 w-[120px]"
                                  }`}
                                >
                                  {quiz?.submission_status}
                                </p>
                              </td>
                              <td className="px-12 py-3 whitespace-nowrap text-blue-300  ">
                                <div className="flex items-center justify-center gap-4 ">
                                  <a
                                    href={quiz.submitted_file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <MdRemoveRedEye
                                      title="Download submitted file"
                                      className="cursor-pointer"
                                      size={23}
                                    />
                                  </a>
                                  {isAdmin && edit && (
                                    <>
                                      <LuUpload
                                        size={20}
                                        className={`
                                      "cursor-pointer hover:opacity-80"
                                    `}
                                        title="Upload"
                                      />

                                      <FaCheck
                                        size={20}
                                        className={`
                                      "cursor-pointer hover:opacity-80"
                                    `}
                                        title="Save"
                                        onClick={() => onUpdateQuiz(iD)}
                                      />
                                    </>
                                  )}
                                  {isAdmin ? null : (
                                    <div>
                                      <LuUpload
                                        size={20}
                                        onClick={
                                          quiz?.id
                                            ? // quiz?.submission_status ===
                                              //   "Submitted" ||
                                              // quiz?.submission_status ===
                                              //   "Late Submission"
                                              () => {
                                                if (
                                                  quiz?.submission_id &&
                                                  quiz?.remaining_resubmissions >
                                                    0
                                                ) {
                                                  handleFileResubmit(
                                                    quiz?.id,
                                                    quiz?.submission_id
                                                  );
                                                }
                                                if (
                                                  quiz?.submission_status !==
                                                  "Submitted"
                                                ) {
                                                  handleFileUpload(quiz?.id);
                                                }
                                                if (
                                                  quiz?.submission_status ===
                                                    "Submitted" &&
                                                  quiz?.remaining_resubmissions ===
                                                    0
                                                ) {
                                                  null;
                                                }
                                              }
                                            : null
                                        }
                                        disabled={
                                          quiz?.remaining_resubmissions === 0 &&
                                          (quiz?.submission_status ===
                                            "Submitted" ||
                                            quiz?.submission_status ===
                                              "Late Submission")
                                        }
                                        // className={`px-4 py-2 rounded-lg ${
                                        //   quiz?.remaining_resubmissions > 0
                                        //     ? "bg-blue-500 text-white"
                                        //     : "bg-gray-300 cursor-not-allowed"
                                        // }`}
                                        className={`${
                                          quiz?.submission_status ===
                                            "Submitted" ||
                                          quiz?.submission_status ===
                                            "Late Submission"
                                            ? "cursor-not-allowed opacity-50"
                                            : "cursor-pointer hover:opacity-80"
                                        } rounded-lg ${
                                          quiz?.remaining_resubmissions > 0
                                            ? "cursor-pointer hover:opacity-80 "
                                            : "text-gray-300 "
                                        }  ${
                                          quiz?.submission_status ===
                                            "Submitted" &&
                                          quiz?.remaining_resubmissions === 0
                                        } ?  ? "cursor-pointer hover:opacity-80 "
                                            : "text-gray-300 "`}
                                        title="Upload"
                                      />
                                    </div>
                                  )}
                                  <button
                                    title="View description"
                                    onClick={() => handleOpenModal(quiz)}
                                  >
                                    <FaFile />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-4 text-dark-300"
                          >
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
      </div>
      <AssessmentDescModal
        isOpen={description}
        quiz={selectedQuiz}
        onClose={handleCloseModal}
        loading={loading}
        field={field}
      />
      {uploadFile && (
        <UplaodingFile
          field={field}
          heading={assessment}
          setUploadFile={setUploadFile}
          assignmentID={iD}
          setUpdateStatus={setUpdateStatus}
          studentInstructorID={studentInstructorID}
        />
      )}

      {resubmitFile && (
        <ResubmissionModal
          field={field}
          heading={assessment}
          setResubmitFile={setResubmitFile}
          assignmentID={iD}
          submissionId={resubmissionId}
          setUpdateStatus={setUpdateStatus}
        />
      )}
    </div>
  );
};

export default StudentDataStructure;
