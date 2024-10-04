import React from "react";

export default function Progress({ progress }) {
  // console.log(progress)
  return (
    <>
      <div className="bg-[#EBF6FF] w-full h-2 rounded-xl">
        <div
          className="bg-blue-300 w-[120px] h-2 rounded-xl"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </>
  );
}
