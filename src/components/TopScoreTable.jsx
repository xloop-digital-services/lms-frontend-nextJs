import { CircularProgress } from "@mui/material";
import React from "react";

const TopScoreTable = ({ scores, loadingScore, showAll }) => {
  return (
    <div className="flex flex-col ">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 pb-0 min-w-full inline-block align-middle">
          <div className="mt-2 border border-dark-300 rounded-lg divide-y divide-dark-200">
            <div className="relative max-h-[65vh] overflow-auto scrollbar-webkit rounded-lg">
              <table className="min-w-full divide-y divide-dark-200 ">
                <thead className="bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
                  <tr>
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
                      Attendence
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Overall Weighted  %
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
                    (showAll ? scores : scores.slice(0, 3)).map(
                      (score, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
                            {score.student_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
                            {score.student_registration_id}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                            {score.grades_summary.assignments.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                            {score.grades_summary.quizzes.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                            {score.grades_summary.projects.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                            {score.grades_summary.exams.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                            {score.grades_summary.attendance_grace_marks.toFixed(
                              2
                            )}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                            {score.grades_summary.overall_percentage.toFixed(2)}
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
