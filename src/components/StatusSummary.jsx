import React from "react";

export default function StatusSummary() {
  return (
    <div className="flex min-w-48  py-2 rounded-xl text-dark-500  justify-between my-2 ">
      Status Summary
      <div className="flex items-center">
        <p className="bg-mix-300 w-2 h-2 rounded-full "></p>
        <p className="mx-2">Submitted</p>
      </div>
      <div className="flex items-center">
        <p className="bg-mix-500 w-2 h-2 rounded-full"></p>
        <p className="mx-2 ">Pending</p>
      </div>
      <div className="flex items-center ">
        <p className="bg-mix-200 w-2 h-2 rounded-full  "></p>
        <p className="mx-2 ">Not Submitted</p>
      </div>
      <div className="flex items-center ">
        <p className="bg-mix-600 w-2 h-2 rounded-full  "></p>
        <p className="mx-2 ">Late Submitted</p>
      </div>
    </div>
  );
}
