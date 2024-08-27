import React from "react";
import { IoClose } from "react-icons/io5";
import { RiArrowDownDoubleFill } from "react-icons/ri";
import SessionCreationModal from "./SessionCreationModal";

const BatchModal = ({ setIsOpenModal }) => {
  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className="w-[550px] z-[1000] mx-auto my-20">
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
              Batch Creation
            </h1>
            <button className="px-2" onClick={() => setIsOpenModal(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div className={`bg-surface-100 p-6 rounded-xl space-y-5 `}>
            <div>
              <div className="flex justify-center items-center">
                <div className="w-full h-[2px] bg-[#485564]"></div>
                <div className="w-full flex items-center ml-2">
                  <span>Basic Information</span>
                  <span>
                    <RiArrowDownDoubleFill />
                  </span>
                </div>
                <div className="w-full h-[2px] bg-[#485564]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-center items-center">
                <div className="w-full h-[2px] bg-[#485564]"></div>
                <div className="w-full flex items-center ml-2">
                  <span>Session Creation</span>
                  <span>
                    <RiArrowDownDoubleFill />
                  </span>
                </div>
                <div className="w-full h-[2px] bg-[#485564]"></div>
              </div>
              <SessionCreationModal />
            </div>
            <div>
              <div className="flex justify-center items-center">
                <div className="w-full h-[2px] bg-[#485564]"></div>
                <div className="w-full flex items-center ml-2">
                  <span className="">Location Creation</span>
                  <span>
                    <RiArrowDownDoubleFill />
                  </span>
                </div>
                <div className="w-full h-[2px] bg-[#485564]"></div>
              </div>
            </div>
            <div className="flex w-full justify-center items-center">
              <button className="w-fit flex justify-center py-3 px-12 text-sm font-medium rounded-lg text-dark-100 bg-[#03A1D8] hover:bg-[#2799bf] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchModal;
