import React from "react";
import { IoEyeSharp } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import Image from "../../public/assets/img/images.png";

const ApprovedTable = ({ selectedOption }) => {
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
                                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>
                        </div>
                    </div> */}
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-dark-200 dark:divide-gray-700">
                <thead className="bg-dark-50 dark:bg-dark-700">
                  <tr>
                    <th scope="col" className="py-3 px-4 pe-0">
                      <div className="flex items-center h-5">
                        <input
                          id="hs-table-pagination-checkbox-all"
                          type="checkbox"
                          className="border-dark-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-dark-800 dark:border-dark-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-dark-800"
                        />
                        <label
                          for="hs-table-pagination-checkbox-all"
                          className="sr-only"
                        >
                          Checkbox
                        </label>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-sm  text-gray-500 uppercase w-[15%]"
                    >
                      {selectedOption} Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-sm  text-gray-500 uppercase w-[15%]"
                    >
                      Age
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-sm  text-gray-500 uppercase w-[15%]"
                    >
                      City
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-sm  text-gray-500 uppercase w-[15%]"
                    >
                      Area
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-sm  text-gray-500 uppercase w-[14%]"
                    >
                      Education
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-sm  text-gray-500 uppercase w-[16%]"
                    >
                      {selectedOption} Interest
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-sm  text-gray-500 uppercase w-[16%]"
                    >
                      Verify
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-sm  text-gray-500 uppercase w-[15%]"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-3 ps-4">
                      <div className="flex items-center h-5">
                        <input
                          id="hs-table-pagination-checkbox-1"
                          type="checkbox"
                          className="border-dark-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        />
                        <label
                          for="hs-table-pagination-checkbox-1"
                          className="sr-only"
                        >
                          Checkbox
                        </label>
                      </div>
                    </td>
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
                      16 years
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      <div className="flex gap-2">
                        <p className="border border-dark-200 py-1 px-2 w-fit rounded-lg">
                          Java
                        </p>
                        <p className="border border-dark-200 py-1 px-2 w-fit rounded-lg">
                          Javascript
                        </p>
                      </div>
                    </td>
                    <td>
                      <p className="bg-mix-200 text-[#fff] rounded-lg px-8 py-2 w-[100px]">
                        False
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium flex space-x-2">
                      <div
                        className="flex items-center group text-dark-600"
                        title="Reject"
                      >
                        <IoMdCloseCircle
                          size={24}
                          className="group-hover:text-mix-200"
                        />
                      </div>
                      <div
                        className="flex items-center group text-dark-600"
                        title="Approve"
                      >
                        <FaCheckCircle
                          size={20}
                          className="group-hover:text-mix-300"
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 ps-4">
                      <div className="flex items-center h-5">
                        <input
                          id="hs-table-pagination-checkbox-1"
                          type="checkbox"
                          className="border-dark-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        />
                        <label
                          for="hs-table-pagination-checkbox-1"
                          className="sr-only"
                        >
                          Checkbox
                        </label>
                      </div>
                    </td>
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
                      16 years
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      <div className="flex gap-2">
                        <p className="border border-dark-200 py-1 px-2 w-fit rounded-lg">
                          Java
                        </p>
                        <p className="border border-dark-200 py-1 px-2 w-fit rounded-lg">
                          Javascript
                        </p>
                      </div>
                    </td>
                    <td>
                      <p className="bg-mix-200 text-[#fff] rounded-lg px-8 py-2 w-[100px]">
                        False
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium flex space-x-2">
                      <div
                        className="flex items-center group text-dark-600"
                        title="Reject"
                      >
                        <IoMdCloseCircle
                          size={24}
                          className="group-hover:text-mix-200"
                        />
                      </div>
                      <div
                        className="flex items-center group text-dark-600"
                        title="Approve"
                      >
                        <FaCheckCircle
                          size={20}
                          className="group-hover:text-mix-300"
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 ps-4">
                      <div className="flex items-center h-5">
                        <input
                          id="hs-table-pagination-checkbox-1"
                          type="checkbox"
                          className="border-dark-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        />
                        <label
                          for="hs-table-pagination-checkbox-1"
                          className="sr-only"
                        >
                          Checkbox
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
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
                      16 years
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      <div className="flex gap-2">
                        <p className="border border-dark-200 py-1 px-2 w-fit rounded-lg">
                          Java
                        </p>
                        <p className="border border-dark-200 py-1 px-2 w-fit rounded-lg">
                          Javascript
                        </p>
                      </div>
                    </td>
                    <td>
                      <p className="bg-mix-200 text-[#fff] rounded-lg px-8 py-2 w-[100px]">
                        False
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium flex space-x-2">
                      <div
                        className="flex items-center group text-dark-600"
                        title="Reject"
                      >
                        <IoMdCloseCircle
                          size={24}
                          className="group-hover:text-mix-200"
                        />
                      </div>
                      <div
                        className="flex items-center group text-dark-600"
                        title="Approve"
                      >
                        <FaCheckCircle
                          size={20}
                          className="group-hover:text-mix-300"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="py-1 px-4">
              <nav className="flex items-center space-x-1">
                <button
                  type="button"
                  className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  <span aria-hidden="true">«</span>
                  <span className="sr-only">Previous</span>
                </button>
                <button
                  type="button"
                  className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10"
                  aria-current="page"
                >
                  1
                </button>
                <button
                  type="button"
                  className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10"
                >
                  2
                </button>
                <button
                  type="button"
                  className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10"
                >
                  3
                </button>
                <button
                  type="button"
                  className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Next</span>
                  <span aria-hidden="true">»</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedTable;