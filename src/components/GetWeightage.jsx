import React from "react";

export default function GetWeightage({ weigh }) {
  // assignWei, quizWei, projWei, examWei
  // console.log(assignWei);
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
                  </tr>
                </thead>

                {weigh?.map((wei) => {
                  return (
                    <tbody
                      key={wei.id}
                      className="divide-y divide-dark-200 dark:divide-gray-700"
                    >
                      <tr>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                          Assignments
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                          {wei.assignments_weightage}%
                        </td>
                      </tr>

                      <tr>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                          Quizzes
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 ">
                          {wei.quizzes_weightage}%
                        </td>
                      </tr>

                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                          Projects
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800 ">
                          {wei.projects_weightage}%
                        </td>
                      </tr>

                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-center">
                          Exam
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                          {wei.exams_weightage}%
                        </td>
                      </tr>

                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-center">
                          Total
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-center">
                          {(Number(wei.assignments_weightage) || 0) +
                            (Number(wei.quizzes_weightage) || 0) +
                            (Number(wei.projects_weightage) || 0) +
                            (Number(wei.exams_weightage) || 0)}
                          %
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
