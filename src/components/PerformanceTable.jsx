import React from "react";
const PerformanceTable = ({
  assignmentWeightage,
  assignmentScore,
  assignmentWeightedScore,
  quizWeightage,
  quizScore,
  quizWeightedScore,
  projectWeightage,
  projectScore,
  projectWeightedScore,
  examsWeightage,
  examsScore,
  examsWeightedScore,
  attenWeightage,
  attenScore,
  attenWeightedScore,
  assignment_total,
  quiz_total,
  project_total,
  exam_total,
  atten_total,
}) => {
  return (
    <div className="flex flex-col ">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 ">
            <div className="overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-dark-300">
                <thead className="bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[20%]"
                    >
                      Component
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[20%]"
                    >
                      Weightage
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[20%]"
                    >
                      Total Marks
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[20%]"
                    >
                      Obtained Marks
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[20%]"
                    >
                      Weighted Score %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200 ">
                  <tr>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                      Assignments
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {Number(assignmentWeightage || 0).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {Number(assignment_total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {Number(assignmentScore || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-2 text-center whitespace-nowrap text-sm text-gray-100  ">
                      {Number(assignmentWeightedScore || 0).toFixed(2)}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                      Quizzes
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {Number(quizWeightage || 0).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {Number(quiz_total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {Number(quizScore || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {Number(quizWeightedScore || 0).toFixed(2)}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                      Projects
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 ">
                      {Number(projectWeightage || 0).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {Number(project_total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 ">
                      {Number(projectScore || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 ">
                      {Number(projectWeightedScore || 0).toFixed(2)}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                      Exam
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                      {Number(examsWeightage || 0).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {Number(exam_total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                      {Number(examsScore || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-100 text-center ">
                      {Number(examsWeightedScore || 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                      Attendance
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                      {Number(attenWeightage || 0).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {Number(atten_total || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                      {Number(attenScore || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-100 text-center ">
                      {Number(attenWeightedScore || 0).toFixed(2)}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-center">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-center">
                      {(
                        assignmentWeightage +
                          quizWeightage +
                          examsWeightage +
                          projectWeightage +
                          attenWeightage || 0
                      ).toFixed(2)}
                      %
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-center">
                      {(
                        assignment_total +
                          quiz_total +
                          project_total +
                          exam_total ||
                        // + attenScore
                        0
                      ).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-center">
                      {(
                        assignmentScore +
                          quizScore +
                          examsScore +
                          projectScore ||
                        // + attenScore
                        0
                      ).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-100 text-center ">
                      {(
                        assignmentWeightedScore +
                          quizWeightedScore +
                          examsWeightedScore +
                          projectWeightedScore +
                          attenWeightedScore || 0
                      ).toFixed(2)}
                      %
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PerformanceTable;
