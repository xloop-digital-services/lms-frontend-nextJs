import React from "react";
import { FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import Image from "../../public/assets/img/images.png";

const QuizTestScreenTable = () => {
  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 ">
            <div className="relative max-h-[75vh] overflow-y-auto scrollbar-webkit">
              <table className="min-w-full divide-y divide-dark-200 ">
                <thead className="bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start rounded-lg text-xs font-medium text-gray-500 uppercase w-[15%]"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start  text-xs font-medium text-gray-500 uppercase w-[17%]"
                    >
                      Total Questions
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[17%]"
                    >
                      Created by
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[17%]"
                    >
                      Updated by
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[17%]"
                    >
                      Last Update
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start rounded-lg font-medium text-xs text-gray-500 uppercase w-[5%]"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      <div class=" flex items-center gap-3">
                        {/* <img src={Image} alt="Floyd image" className='w-9' /> */}
                        <div class="data">
                          <p class="font-normal text-sm text-gray-900">
                            Floyd Miles
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      25
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      Karachi
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      Dastagir
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      16-10-2024
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-blue-300  text-end text-sm font-medium flex space-x-2">
                      <div
                        className="flex items-center  cursor-pointer"
                        title="edit"
                      >
                        <FaEdit
                          size={24}
                          className=""
                        />
                      </div>
                      <div
                        className="flex items-center  cursor-pointer"
                        title="delete"
                      >
                        <FaTrash
                          size={20}
                          className=""
                        />
                      </div>
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

export default QuizTestScreenTable;
