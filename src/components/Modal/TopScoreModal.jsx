import React from "react";
import TopScoreTable from "../TopScoreTable";
import { IoClose } from "react-icons/io5";

const TopScoreModal = ({ scores, loadingScore, showAll, setOpenList }) => {
  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className=" w-[1300px] z-[1000] mx-auto my-20 overflow-auto scrollbar-webkit">
        <div
          //   ref={modalClose}
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
              className="text-start  px-2 xsm:py-[10px] pb-[5px] font-exo"
            >
              Top Performers
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

          <div className="bg-surface-100 xsm:p-4 px-3 py-4 rounded-xl xsm:space-y-5 space-y-2 font-inter ">
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