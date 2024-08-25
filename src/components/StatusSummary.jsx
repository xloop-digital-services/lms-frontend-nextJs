import React from "react";

export default function StatusSummary() {
  return (
    <div className="flex min-w-48 h-[120px] py-2 px-4 rounded-xl text-dark-400  justify-between my-2 flex-col border border-dark-300 ">
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
    </div>
  );
}
