import React from "react";
const StudentMarksTable = ({ field, assessments }) => {
  console.log(assessments);
  return (
    <div className="flex flex-col cursor-default">
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
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[28%]"
                    >
                      {field} Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[28%]"
                    >
                      Total Marks
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[28%]"
                    >
                      Obtained Marks
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[28%]"
                    >
                      Remarks
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[28%]"
                    >
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-dark-200 dark:divide-gray-700">
                  {assessments && assessments.length > 0 ? (
                    assessments?.map((assessment, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200 text-wrap">
                              {assessment?.exam_name ||
                                assessment?.quiz_name ||
                                assessment?.assignment_name ||
                                assessment?.project_name}
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              {assessment?.total_marks
                                ? assessment.total_marks
                                : 0}
                            </td>

                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              {assessment?.marks_obtain
                                ? assessment.marks_obtain
                                : 0}
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-wrap text-sm text-gray-800 dark:text-gray-200">
                              {assessment?.remarks ? assessment.remarks : "-"}
                            </td>

                            <td className="px-12 py-4 text-center whitespace-nowrap flex w-full justify-center items-center text-sm text-surface-100 ">
                              <p
                                className={`w-[110px] text-center px-4 py-2 text-[12px] rounded-lg ${
                                  assessment?.status === "Submitted"
                                    ? "bg-mix-300 w-110px]"
                                    : assessment?.status === "Pending"
                                    ? "bg-mix-500 text-[#fff] w-[110px]"
                                    : "bg-mix-200 w-110px]"
                                }`}
                              >
                                {assessment?.status}
                              </p>
                            </td>
                          </tr>
                          {/* <tr>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-bold text-gray-800 dark:text-gray-200">
                              Total
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-bold text-gray-800 dark:text-gray-200">
                              {assessments.reduce(
                                (sum, assessment) =>
                                  sum + (assessment?.total_marks || 0),
                                0
                              )}
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-bold text-gray-800 dark:text-gray-200">
                              {assessments.reduce(
                                (sum, assessment) =>
                                  sum + (assessment?.marks_obtain || 0),
                                0
                              )}
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              -
                            </td>
                            <td className="px-12 py-4 text-center whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              -
                            </td>
                          </tr> */}
                        </>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
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
  );
};
export default StudentMarksTable;
