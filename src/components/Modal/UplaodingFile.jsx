import React from "react";
import { IoClose } from "react-icons/io5";

const UplaodingFile = ({ field, setUploadFile }) => {
  return (
    <div className="backDropOverlay flex justify-center items-center">
      <div className="   w-[550px] z-[1000] mx-auto my-20">
        <div style={{ backgroundColor: "#EBF6FF" }} className="p-5 rounded-xl">
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#07224D",
              }}
              className="text-start  px-2 py-[10px]"
            >
              Upload {field}
            </h1>
            <button className="px-2" onClick={() => setUploadFile(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div className="bg-surface-100 p-6 rounded-xl space-y-5">
            <div className="bg-[#EBF6FF] space-y-1 flex flex-col justify-center items-center p-4 border border-dashed border-blue-300 rounded-lg">
              <button className="border border-blue-300 p-3 text-[15px] rounded-lg ">
                Upload File
              </button>
              <p className="text-[13px]">
                Drag & drop files or{" "}
                <span className="text-blue-300">Browse</span>
              </p>
              <p className="text-[#92A7BE] text-[12px]">
                Supported formates: XLSX, XLS, CSV, XLSM, XlSB, DIF
              </p>
            </div>
            <div className="space-y-2 text-[15px]">
              <p className="">Comment</p>
              <input
                type="text"
                className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                placeholder="regarding assignment or note"
              />
            </div>
            <div className="flex w-full justify-center items-center">
              <button
                type="submit"
                class="w-fit flex justify-center py-3 px-12 text-sm font-medium rounded-lg text-dark-100 bg-[#03A1D8] hover:bg-[#2799bf] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UplaodingFile;
