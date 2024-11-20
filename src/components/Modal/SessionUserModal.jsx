import { CircularProgress } from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";

const SessionUserModal = ({ loading, students }) => {
  return (
    <div>
      {loading ? (
        <div>
          <CircularProgress size={20} />
        </div>
      ) : (
        <div>
          {students.length > 0 ? (
            <div>
              {/* <p className="font-bold text-lg pb-2 text-blue-500 font-exo">
                  Student Names
                </p> */}
              <table className="min-w-full divide-y divide-dark-300 ">
                <thead className="bg-surface-100 text-blue-500 top-0 z-10 shadow-sm shadow-dark-200">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                      Student ID
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                      Student Name
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200 overflow-y-scroll scrollbar-webkit">
                  {students.map((student, index) => (
                    <tr key={index}>
                      <td className="px-6 py-3 text-center whitespace-nowrap text-sm text-gray-800">
                        {student.registration_id}
                      </td>
                      <td className="px-6 py-3 text-center whitespace-nowrap text-sm text-gray-800 ">
                        {student.user}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-sm text-dark-400 py-4">
              No students found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionUserModal;
