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
  function calculateScore(a, b, c, d) {
    score = sum(a, b, c, d);
  }

  function calculateTotalPercentage(a, b, c, d) {}
  return (
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
                    {/* <th scope="col" className="py-3 px-4 pe-0">
                      <div className="flex items-center h-5">
                        <input id="hs-table-pagination-checkbox-all" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                        <label for="hs-table-pagination-checkbox-all" className="sr-only">Checkbox</label>
                      </div> 
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[28%]"
                    >
                      Component
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[28%]"
                    >
                      Weightage
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[28%]"
                    >
                      Score
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[28%]"
                    >
                      Weighted Score %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200 dark:divide-gray-700">
                  <tr>
                    {/* <td className="py-3 ps-4">
                       <div className="flex items-center h-5">
                        <input id="hs-table-pagination-checkbox-1" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                        <label for="hs-table-pagination-checkbox-1" className="sr-only">Checkbox</label>
                      </div> 
                    </td> */}
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
                    {/* <td className="py-3 ps-4">
                      <div className="flex items-center h-5">
                        <input id="hs-table-pagination-checkbox-2" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                        <label for="hs-table-pagination-checkbox-2" className="sr-only">Checkbox</label>
                      </div>
                    </td> */}
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
                    {/* <td className="py-3 ps-4">
                      <div className="flex items-center h-5">
                        <input id="hs-table-pagination-checkbox-3" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                        <label for="hs-table-pagination-checkbox-3" className="sr-only">Checkbox</label>
                      </div>
                    </td> */}
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
                    {/* <td className="py-3 ps-4">
                      <div className="flex items-center h-5">
                        <input id="hs-table-pagination-checkbox-4" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                        <label for="hs-table-pagination-checkbox-4" className="sr-only">Checkbox</label>
                      </div>
                    </td> */}
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
                    {/* <td className="py-3 ps-4">
                      <div className="flex items-center h-5">
                        <input id="hs-table-pagination-checkbox-5" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                        <label for="hs-table-pagination-checkbox-5" className="sr-only">Checkbox</label>
                      </div>
                    </td> */}
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
