import React, { useState } from "react";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { MdRemoveRedEye } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import UplaodingFile from "./Modal/UplaodingFile";
import {
  FaFileDownload,
  FaFilePdf,
  FaInfoCircle,
  FaRegFilePdf,
} from "react-icons/fa";
import { downloadFile } from "@/app/courses/course/[courseId]/page";

export function formatDateTime(apiDateTime) {
  const dateObject = new Date(apiDateTime);

  const day = String(dateObject.getUTCDate()).padStart(2, "0");
  const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
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

const StudentDataStructure = ({
  quizzes,
  field,
  assessment,
  assessmentNumber,
  dueDate,
  status,
  remarks,
}) => {
  const [uploadFile, setUploadFile] = useState(false);
  const [iD, setId] = useState("");

  const handleFileUpload = (id) => {
    // console.log(field, "id", id);
    setId(id);
    setUploadFile(!uploadFile);
  };

  return (
    <div>
      <div className="flex flex-col ">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
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
                <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                  <thead className="bg-dark-100 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                      >
                        {assessment}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                      >
                        Created Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                      >
                        Due Date
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                      >
                        Submission Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-dark-200 dark:divide-gray-700">
                    {quizzes && quizzes.length > 0 ? (
                      quizzes?.map((quiz, index) => {
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                              {quiz.question || quiz.title}
                            </td>
                            <td className="px-6 py-2 flex justify-center items-center  text-center whitespace-nowrap text-sm text-surface-100 ">
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
                            <td className="px-6 py-4  text-center whitespace-nowrap text-sm text-gray-800">
                              {formatDateTime(quiz?.created_at)}
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                              {formatDateTime(quiz?.due_date)}
                            </td>

                            {}
                            <td className="px-5 py-4 flex justify-center items-center text-center whitespace-nowrap text-sm text-[#03A1D8] font-medium space-x-4">
                              {/* <div>
                                  <MdRemoveRedEye size={23} />{" "}
                                </div> */}
                              <div>
                                <LuUpload
                                  size={23}
                                  onClick={
                                    quiz?.status !== "Submitted"
                                      ? () => handleFileUpload(quiz?.id)
                                      : undefined
                                  }
                                  className={`${
                                    quiz?.status === "Submitted"
                                      ? "cursor-not-allowed opacity-50"
                                      : "cursor-pointer hover:opacity-80"
                                  }`}
                                  title="upload"
                                  style={{
                                    pointerEvents:
                                      quiz?.status === "Submitted"
                                        ? "none"
                                        : "auto",
                                  }}
                                />
                              </div>
                              <div
                              // className="flex items-center gap-2 group "
                              // key={file.id}
                              >
                                <a
                                  href={quiz.content}
                                  className="group-hover:cursor-pointer flex justify-center items-center"
                                  download
                                >
                                  <FaFileDownload
                                    size={20}
                                    fill="#03A1D8"
                                    className="group-hover:cursor-pointer"
                                  />
                                  <button
                                    onClick={() => downloadFile(quiz.content)}
                                    download
                                    className="flex items-center text-blue-300 group-hover:cursor-pointer"
                                  >
                                    {/* {quiz.content.split("/").pop()} */}
                                  </button>
                                </a>
                                {/* <p>{downloadStatus}</p> */}
                              </div>
                            </td>
                            <td className="px-6 py-4  text-center whitespace-nowrap text-sm text-gray-800">
                              {quiz?.submitted_at
                                ? formatDateTime(quiz?.submitted_at)
                                : "-"}
                            </td>
                          </tr>
                        );
                      })
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
          setUploadFile={setUploadFile}
          assignmentID={iD}
        />
      )}
    </div>
  );
};

export default StudentDataStructure;
