import React from "react";
import { FaBell } from "react-icons/fa";

export default function Notifications() {
  return (
    <>
      <div className="flex flex-col p-1 h-80 overflow-y-scroll">
        <h3 className="font-bold px-2 ">Notifications</h3>
        <div className="flex px-4 justify-center items-center">
          <div className="flex justify-center w-12 h-7 items-center rounded-full border border-1 mx-4 border-blue-300 bg-blue-600">
            <FaBell size={20} fill="#03A1D8" />
          </div>
          <div className="flex flex-col">
            <p className="font-md">
              Rafay uploaded an assignment in UI UX Design Course
            </p>
            <p className="text-dark-400 font-sm">2 hours ago</p>
          </div>
        </div>
        <hr className="text-dark-200 mx-4 my-2"></hr>

        {/* noti 2 */}
        <div className="flex px-4 justify-center items-center">
          <div className="flex justify-center w-12 h-7 items-center rounded-full border border-1 mx-4 border-blue-300 bg-blue-600">
            <FaBell size={20} fill="#03A1D8" />
          </div>
          <div className="flex flex-col">
            <p className="font-md">
              Rafay uploaded an assignment in UI UX Design Course
            </p>
            <p className="text-dark-400 font-sm">2 hours ago</p>
          </div>
        </div>
        <hr className="text-dark-200 mx-4 my-2"></hr>

        {/* noti 3 */}
        <div className="flex px-4 justify-center items-center">
          <div className="flex justify-center w-12 h-7 items-center rounded-full border border-1 mx-4 border-blue-300 bg-blue-600">
            <FaBell size={20} fill="#03A1D8" />
          </div>
          <div className="flex flex-col">
            <p className="font-md">
              Rafay uploaded an assignment in UI UX Design Course
            </p>
            <p className="text-dark-400 font-sm">2 hours ago</p>
          </div>
        </div>
        <hr className="text-dark-200 mx-4 my-2"></hr>
      </div>
    </>
  );
}
