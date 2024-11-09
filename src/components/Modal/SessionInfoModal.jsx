import React from "react";
import { IoClose } from "react-icons/io5";

const SessionInfoModal = ({ setOpenModal, selectedSession }) => {
  // console.log('session for info',selectedSession)
  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className=" w-[600px] z-[1000] mx-auto my-20 overflow-auto scrollbar-webkit">
        <div
          style={{ backgroundColor: "#EBF6FF" }}
          className="xsm:p-5 p-2 m-2 rounded-xl"
        >
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#022567",
              }}
              className="text-center  px-2 xsm:py-[10px] pb-[5px] font-exo"
            >
              Information
            </h1>
            <button className="px-2" onClick={() => setOpenModal(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div className="bg-surface-100 xsm:p-6 px-3 py-4 rounded-xl xsm:space-y-5 space-y-2 font-inter">
            <div>
              <table className="min-w-full divide-y divide-dark-200 ">
                <thead className="bg-surface-100 text-blue-500 sticky top-0 z-40 shadow-sm shadow-dark-200">
                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                  >
                    Days
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[12%]"
                  >
                    End Time
                  </th>
                </thead>
                <tbody>
                  {selectedSession.schedules.length > 0 ? (
                    selectedSession.schedules.map((session, index) => (
                      <tr className="last:border-0 border-b border-[#d7e4ee]" key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-200">
                          {session.day_of_week}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-200">
                          {session.start_time}
                        </td>{" "}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800 dark:text-gray-200">
                          {session.end_time}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 whitespace-nowrap text-sm text-dark-400 dark:text-gray-200 text-center"
                      >
                        no time is scheduled
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

export default SessionInfoModal;