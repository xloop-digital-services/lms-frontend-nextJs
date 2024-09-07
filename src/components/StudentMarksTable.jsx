import React from "react";
const StudentMarksTable = ({ field, assessments }) => {
  console.log(assessments);
  return (
    <div className="flex flex-col cursor-default">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                <thead className="bg-dark-100 dark:bg-gray-700">
                  <tr>
                  <th
                      scope="col"
                      className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Registration Id
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Student Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Total Marks
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Obtained Marks
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Remarks
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                    >
                      Grade
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4  text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
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
                            <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                              {assessment?.registration_id }
                            </td>
                            <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                              {assessment?.student_name }
                            </td>
                            <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                              {assessment?.total_marks
                                ? assessment.total_marks
                                : 0}
                            </td>

                            <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                              {assessment?.marks_obtain
                                ? assessment.marks_obtain
                                : 0}
                            </td>
                            <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                              {assessment?.remarks ? assessment.remarks : "-"}
                            </td>
                            <td className="px-6 py-4 text-wrap text-center whitespace-nowrap text-sm font-medium text-gray-800 ">
                              {assessment?.grade ? assessment.remarks : "-"}
                            </td>

                            <td className="px-12 py-2  whitespace-nowrap text-sm text-surface-100">
                              <p
                                className={`w-[110px] text-center px-4 py-2 text-[12px] rounded-lg ${
                                  assessment?.submission_status === "Submitted"
                                    ? "bg-mix-300 w-110px]"
                                    : assessment?.submission_status === "Pending"
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
                      <td colSpan="8" className="text-center w-full py-4">
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
