"use client";
import React, { useEffect, useRef, useState } from "react";
import TopScoreTable from "../TopScoreTable";
import { IoClose } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";

import { downloadExcel } from "@/utils/downloadExcel";


const TopScoreModal = ({ scores, loadingScore, showAll, setOpenList, title }) => {
  const menuRef = useRef();
  const tableRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <div className="backDropOverlay h-screen fixed flex justify-center items-center">
      <div className="w-[1500px] z-[1000] mx-auto my-20 overflow-auto scrollbar-webkit">
        <div style={{ backgroundColor: "#EBF6FF" }} className="xsm:p-3 p-2 m-2 rounded-xl">
          <div className="flex justify-between items-center">
            <h1
              className="text-start px-2 xsm:py-[10px] pb-[5px] font-exo"
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#022567",
              }}
            >
              Student Performance Report {title}
            </h1>
            <div className="flex gap-2 items-center">

              <div className="relative inline-block" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  title="Download student performance report"
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-300"
                >
                  <FaDownload className="text-blue-500" />
                </button>
                {showMenu && (
                  <div className="absolute left-[-10rem] mt-2 w-48 bg-surface-100 border border-dark-300 rounded shadow-md z-50">

                    <button
                      onClick={() => downloadPDF(scores, title)}
                      className="w-full text-left px-4 py-2 hover:bg-dark-100"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => downloadExcel(scores, title)}
                      className="w-full text-left px-4 py-2 hover:bg-dark-100"
                    >
                      Export as Excel
                    </button>
                  </div>
                )}
              </div>
              <button className="px-2" onClick={() => setOpenList(false)}>
                <IoClose size={21} />
              </button>
            </div>
          </div>

          <div
            className="bg-surface-100 xsm:p-4 px-2 py-4 rounded-xl xsm:space-y-5 space-y-2 font-inter"
            ref={tableRef}
          >
            <TopScoreTable scores={scores} loadingScore={loadingScore} showAll={showAll} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopScoreModal;
