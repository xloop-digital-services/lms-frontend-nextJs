"use client";
import DataScreen from "@/components/DataScreen";
import TopPart from "@/components/TopPart";
import React from "react";
import { FaFile, FaFilePdf } from "react-icons/fa";
import { useSidebar } from "@/providers/useSidebar";
import StudentAttendence from "@/components/Student/StudentAttendence";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const Module = 'Module';
  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-20 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "84%" : "100%",
      }}
    >
      <div className=" bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        
      <TopPart/>
      <StudentAttendence/>
      </div>
    </div>
  );
}
