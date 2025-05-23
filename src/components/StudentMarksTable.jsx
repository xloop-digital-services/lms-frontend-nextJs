import React from "react";


const StudentMarksTable = ({ field, assessments, role }) => {
  //console.log(assessments);
  return (
    <div className="flex flex-col cursor-default">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden rounded-lg">
              <div className="relative max-h-[55vh] overflow-y-auto scrollbar-webkit">
                <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                  <thead className=" bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                      >
                        {field} Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                      >
                        Total Marks
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                      >
                        Obtained Marks
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
                      >
                        Remarks
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[23%]"
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                                {assessment?.exam_name ||
                                  assessment?.quiz_name ||
                                  assessment?.assignment_name ||
                                  assessment?.project_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                                {assessment?.total_marks
                                  ? assessment.total_marks
                                  : 0}
                              </td>
                              {
                                role === "student" ? (
                                  <>
                                    {assessment?.grading_flag === false ? (
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                                        {assessment?.marks_obtain ? assessment?.marks_obtain : 0}
                                      </td>
                                    ) : (
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                                        Not graded yet
                                      </td>
                                    )}

                                    {assessment?.grading_flag === false ? (
                                      <td
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center"
                                        style={{
                                          wordBreak: "break-word",
                                          overflowWrap: "break-word",
                                          whiteSpace: "normal",
                                        }}
                                      >
                                        {assessment?.remarks ? assessment.remarks : "-"}
                                      </td>
                                    ) : (
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                                        Not graded yet
                                      </td>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                                      {assessment?.marks_obtain ? assessment?.marks_obtain : 0}
                                    </td>
                                    <td
                                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center"
                                      style={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "normal",
                                      }}
                                    >
                                      {assessment?.remarks ? assessment.remarks : "-"}
                                    </td>
                                  </>
                                )
                              }
                              
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center text-surface-100">
                                <p
                                  className={`w-[120px] text-center px-4 py-2 text-[12px] rounded-lg ${assessment?.status === "Submitted"
                                    ? "bg-mix-300 w-[120px]"
                                    : assessment?.status === "Pending"
                                      ? "bg-mix-500 text-[#fff] w-[120px]"
                                      : assessment?.status === "Late Submission"
                                        ? "bg-mix-600 text-[#fff] w-[110px]"
                                        : "bg-mix-200 w-[120px]"
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
                        <td
                          colSpan="10"
                          className="text-center w-full py-4 text-dark-300"
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
  );
};
export default StudentMarksTable;
