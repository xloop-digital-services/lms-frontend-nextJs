import { CircularProgress } from "@mui/material";
import React, { useEffect } from "react";

const TopScoreTable = ({ total, scores, loadingScore, showAll }) => {
  // console.log(scores);
  const totalQuizMarks = total?.grades_summary?.total_quiz_marks || 0;
  return (
    <div className="flex flex-col ">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 pb-0 min-w-full inline-block align-middle">
          <div className="mt-2 border border-dark-300 rounded-lg divide-y divide-dark-200">
            <div className="relative max-h-[65vh] overflow-auto scrollbar-webkit rounded-lg">
              <table className="min-w-full divide-y divide-dark-200 ">
                <thead className="bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
                  <tr>
                    {showAll && (
                      <th
                        scope="col"
                        className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[7%]"
                      >
                        S. NO.
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Student Names
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Registration ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Assignment
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Quiz
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Project
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Exam
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Attendance
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
                    >
                      Overall Weighted %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200 ">
                  {loadingScore ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <CircularProgress size={20} />
                      </td>
                    </tr>
                  ) : scores.length > 0 ? (
                    (showAll ? scores : scores.slice(0, 2)).map(
                      (score, index) => (
                        <tr key={index}>
                          {showAll && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                              {index + 1}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
                            {score.student_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
                            {score.student_registration_id}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {(
                              score.grades_summary?.assignments
                                ?.obtained_marks ??
                              score.grades_summary?.assignments ??
                              0
                            ).toFixed(1)}{" "}
                            /{" "}
                            {score.grades_summary?.assignments?.total_marks ??
                              score.grades_summary?.total_assignment_marks ??
                              0}
                          </td>

                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {(
                              score.grades_summary?.quizzes?.obtained_marks ??
                              score.grades_summary?.quizzes ??
                              0
                            ).toFixed(1)}{" "}
                            /{" "}
                            {score.grades_summary?.quizzes?.total_marks ??
                              score.grades_summary?.total_quiz_marks ??
                              0}
                          </td>

                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {(
                              score.grades_summary?.projects?.obtained_marks ??
                              score.grades_summary?.projects ??
                              0
                            ).toFixed(1)}{" "}
                            /{" "}
                            {score.grades_summary?.projects?.total_marks ??
                              score.grades_summary?.total_project_marks ??
                              0}
                          </td>

                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                            {(
                              score.grades_summary?.exams?.obtained_marks ??
                              score.grades_summary?.exams ??
                              0
                            ).toFixed(1)}{" "}
                            /{" "}
                            {score.grades_summary?.exams?.total_marks ??
                              score.grades_summary?.total_exam_marks ??
                              0}
                          </td>

                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                            {score.grades_summary.attendance_grace_marks.toFixed(
                              1
                            )}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                            {score.grades_summary.overall_percentage.toFixed(1)}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No scores available.
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
  );
};

export default TopScoreTable;
