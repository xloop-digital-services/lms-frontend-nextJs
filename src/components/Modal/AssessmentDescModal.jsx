"use client";
import { downloadFile } from "@/app/courses/course/[courseId]/page";
import { useAuth } from "@/providers/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { IoClose } from "react-icons/io5";

const AssessmentDescModal = ({
  isOpen,
  quiz,
  onClose,
  loading,
  field,
  admin,
}) => {
  if (!isOpen || !quiz) return null;

  //   //console.log(quiz);
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
                  {field} Description
                </h1>
                <button className="p-2" onClick={onClose}>
                  <IoClose size={25} />
                </button>
              </div>
              <div className="bg-surface-100 p-4 rounded-2xl text-center">
                <h2 className="text-xl flex justify-center font-semibold mb-4 font-exo text-blue-500 ">
                  {quiz.question || "Quiz Details"}
                </h2>
                <p className=" flex items-center justify-center mx-12 my-3 text-center text-blue-300">
                  {quiz.description || "No description available."}
                </p>

                {quiz?.content ? (
                  <div className="flex items-center capitalize justify-center my-4 gap-2">
                    <p className="">Attached file:</p>
                    <a
                      href="#"
                      className="cursor-pointer flex justify-center items-center text-black hover:text-[#2563eb] hover:underline"
                      title="Download Assessment file"
                      onClick={(e) => {
                        e.preventDefault();
                        downloadFile(quiz.content);
                      }}
                    >
                      {quiz?.content?.split("/").pop()}
                      {/* {quiz.assignment_name} */}
                    </a>
                  </div>
                ) : (
                  <p className="text-mix-200 my-4">No file attached </p>
                )}

                {/* {isStudent && (
                  <div className="flex items-center justify-center my-4 gap-2">
                    <p className="">Submission status:</p>
                    <p
                      className={`w-[120px] text-center px-4 py-2 text-[12px] rounded-lg ${
                        quiz?.submission_status === "Submitted"
                          ? "bg-mix-300 text-surface-100 w-[120px]"
                          : quiz?.submission_status === "Pending"
                          ? "bg-mix-500 text-surface-100 w-[120px]"
                          : quiz?.submission_status === "Late Submission"
                          ? "bg-mix-600 text-surface-100 w-[110px]"
                          : "bg-mix-200 w-[120px] text-surface-100"
                      }`}
                    >
                      {quiz?.submission_status}
                    </p>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDescModal;