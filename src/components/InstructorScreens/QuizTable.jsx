import React from "react";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { MdRemoveRedEye } from "react-icons/md";

const QuizTable = () => {
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
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[23%]"
                    >
                      Student ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[23%]"
                    >
                      Student Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[23%]"
                    >
                      Submission Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[23%]"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[23%]"
                    >
                      Action
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      9002158
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      Ali Imran
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      15/07/2024
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-surface-100 dark:text-gray-200 ">
                      <p className="bg-mix-300 w-[90px] text-center px-4 py-2 text-[12px] rounded-lg">
                        Checked
                      </p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-end text-sm text-[#03A1D8] font-medium flex space-x-5">
                      <div>
                        {" "}
                        <LiaFileDownloadSolid size={23} />
                      </div>
                      <div>
                        <MdRemoveRedEye size={23} />{" "}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    {/* <td className="py-3 ps-4">
                  <div className="flex items-center h-5">
                    <input id="hs-table-pagination-checkbox-2" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                    <label for="hs-table-pagination-checkbox-2" className="sr-only">Checkbox</label>
                  </div>
                </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      9002158
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      Ali Imran
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      15/07/2024
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-surface-100 dark:text-gray-200 ">
                      <p className="bg-mix-300 w-[90px] text-center1 px-4 py-2 text-[12px] rounded-lg">
                        Checked
                      </p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-end text-sm text-[#03A1D8] font-medium flex space-x-5">
                      <div>
                        {" "}
                        <LiaFileDownloadSolid size={23} />
                      </div>
                      <div>
                        <MdRemoveRedEye size={23} />{" "}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    {/* <td className="py-3 ps-4">
                  <div className="flex items-center h-5">
                    <input id="hs-table-pagination-checkbox-3" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                    <label for="hs-table-pagination-checkbox-3" className="sr-only">Checkbox</label>
                  </div>
                </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      9002158
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      Ali Imran
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      15/07/2024
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-surface-100 dark:text-gray-200 ">
                      <p className="bg-mix-300 w-[90px] text-center px-4 py-2 text-[12px] rounded-lg">
                        Checked
                      </p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-end text-sm text-[#03A1D8] font-medium flex space-x-5">
                      <div>
                        {" "}
                        <LiaFileDownloadSolid size={23} />
                      </div>
                      <div>
                        <MdRemoveRedEye size={23} />{" "}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    {/* <td className="py-3 ps-4">
                  <div className="flex items-center h-5">
                    <input id="hs-table-pagination-checkbox-4" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                    <label for="hs-table-pagination-checkbox-4" className="sr-only">Checkbox</label>
                  </div>
                </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      9002158
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      Ali Imran
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      15/07/2024
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-surface-100 dark:text-gray-200 ">
                      <p className="bg-mix-200 w-[90px] text-center px-4 py-2 text-[12px] rounded-lg">
                        Pending
                      </p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-end text-sm text-[#03A1D8] font-medium flex space-x-5">
                      <div>
                        {" "}
                        <LiaFileDownloadSolid size={23} />
                      </div>
                      <div>
                        <MdRemoveRedEye size={23} />{" "}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    {/* <td className="py-3 ps-4">
                  <div className="flex items-center h-5">
                    <input id="hs-table-pagination-checkbox-5" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                    <label for="hs-table-pagination-checkbox-5" className="sr-only">Checkbox</label>
                  </div>
                </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      9002158
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      Ali Imran
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      15/07/2024
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-surface-100 dark:text-gray-200 ">
                      <p className="bg-mix-300 w-[90px] text-center px-4 py-2 text-[12px] rounded-lg">
                        Checked
                      </p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-end text-sm text-[#03A1D8] font-medium flex space-x-5">
                      <div>
                        {" "}
                        <LiaFileDownloadSolid size={23} />
                      </div>
                      <div>
                        <MdRemoveRedEye size={23} />{" "}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    {/* <td className="py-3 ps-4">
                  <div className="flex items-center h-5">
                    <input id="hs-table-pagination-checkbox-5" type="checkbox" className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                    <label for="hs-table-pagination-checkbox-5" className="sr-only">Checkbox</label>
                  </div>
                </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      9002158
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      Ali Imran
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      15/07/2024
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-surface-100 dark:text-gray-200 ">
                      <p className="bg-mix-300 w-[90px] text-center px-4 py-2 text-[12px] rounded-lg">
                        Checked
                      </p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-end text-sm text-[#03A1D8] font-medium flex space-x-5">
                      <div>
                        {" "}
                        <LiaFileDownloadSolid size={23} />
                      </div>
                      <div>
                        <MdRemoveRedEye size={23} />{" "}
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
                  className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-surface-100 dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  <span aria-hidden="true">«</span>
                  <span className="sr-only">Previous</span>
                </button>
                <button
                  type="button"
                  className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-surface-100 dark:hover:bg-white/10"
                  aria-current="page"
                >
                  1
                </button>
                <button
                  type="button"
                  className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-surface-100 dark:hover:bg-white/10"
                >
                  2
                </button>
                <button
                  type="button"
                  className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-surface-100 dark:hover:bg-white/10"
                >
                  3
                </button>
                <button
                  type="button"
                  className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-surface-100 dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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

export default QuizTable;