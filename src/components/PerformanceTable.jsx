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
}) => {
  return (
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
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                    >
                      Score
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                    >
                      Weighted Score %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                      Assignments
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {assignmentWeightage}%
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {assignmentScore}
                    </td>
                    <td className="px-6 py-2 text-center whitespace-nowrap text-sm text-gray-100  ">
                      {assignmentWeightedScore}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                      Quizzes
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {quizWeightage}%
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {quizScore}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                      {quizWeightedScore}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                      Projects
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 ">
                      {projectWeightage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 ">
                      {projectScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 ">
                      {projectWeightedScore}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                      Exam
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                      {examsWeightage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                      {examsScore}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-100 text-center ">
                      {examsWeightedScore}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-center">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-center">
                      {assignmentWeightage +
                        quizWeightage +
                        examsWeightage +
                        projectWeightage}
                      %
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-center">
                      {assignmentScore + quizScore + examsScore + projectScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-100 text-center ">
                      {assignmentWeightedScore +
                        quizWeightedScore +
                        examsWeightedScore +
                        projectWeightedScore}
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
