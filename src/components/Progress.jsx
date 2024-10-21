import React from "react";

export default function Progress({ progress }) {
  const roundedProgress = Math.round(progress);

  return (
    <div className="flex items-center justify-between">
      <div className="bg-[#EBF6FF] w-full h-2 rounded-xl relative">
        <div
          className="bg-blue-300 h-2 rounded-xl"
          style={{ width: `${roundedProgress}%` }}
        ></div>
      </div>

      <div className="text-blue-300 font-bold ml-4">{roundedProgress}%</div>
    </div>
  );
}
