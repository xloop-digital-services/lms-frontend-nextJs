import React from 'react'

const LocationsTable = () => {
    return (
        <div className="flex flex-col ">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="mt-4 border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
                <div className="overflow-hidden " >
                  <table className="min-w-full  divide-y divide-dark-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[25%]"
                        >
                          City
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%]"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%]"
                        >
                          Location Code
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%]"
                        >
                          Capacity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[20%]"
                        >
                          Active Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                          Karachi
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          Gulshan e Iqbal
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          KHI
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                         50
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap flex w-full justify-start text-sm text-surface-100 dark:text-gray-200 ">
                          <p className="bg-[#18A07A] w-[90px] text-center px-4 py-2 text-[12px] rounded-lg">
                            Active
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="py-1 px-4">
                  <nav className="flex items-center space-x-1">
                    <button
                      type="button"
                      className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-surface-100/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      <span aria-hidden="true">«</span>
                      <span className="sr-only">Previous</span>
                    </button>
                    <button
                      type="button"
                      className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-surface-100/10"
                      aria-current="page"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-surface-100/10"
                    >
                      2
                    </button>
                    <button
                      type="button"
                      className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-surface-100/10"
                    >
                      3
                    </button>
                    <button
                      type="button"
                      className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-surface-100/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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
}

export default LocationsTable