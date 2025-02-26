"use client";
import React, { useEffect } from "react";
import TopScoreTable from "../TopScoreTable";
import { IoClose } from "react-icons/io5";

const TopScoreModal = ({ scores, loadingScore, showAll, setOpenList }) => {
  // useEffect(() => {
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, []);
  return (
    <div className="backDropOverlay h-screen fixed flex justify-center items-center">
      <div className=" w-[1500px] z-[1000] mx-auto my-20 overflow-auto scrollbar-webkit">
        <div
          //   ref={modalClose}
          style={{ backgroundColor: "#EBF6FF" }}
          className="xsm:p-3 p-2 m-2 rounded-xl"
        >
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#022567",
              }}
              className="text-start  px-2 xsm:py-[10px] pb-[5px] font-exo"
            >
              Student Performance Report
            </h1>
            <button
              className="px-2"
              onClick={() => {
                setOpenList(false);
              }}
            >
              <IoClose size={21} />
            </button>
          </div>

          <div className="bg-surface-100 xsm:p-4 px-2 py-4 rounded-xl xsm:space-y-5 space-y-2 font-inter ">
            <TopScoreTable
              scores={scores}
              loadingScore={loadingScore}
              showAll={showAll}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopScoreModal;
