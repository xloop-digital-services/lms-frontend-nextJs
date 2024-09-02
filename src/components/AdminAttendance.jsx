"use client"
import { useSidebar } from "@/providers/useSidebar";
import React from "react";

export default function AdminAttendance() {
  const { isSidebarOpen } = useSidebar();
  return (
    <div
      className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-10"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "85%" : "100%",
      }}
    >
      Attendance for admin coming soon.. 
    </div>
  );
}
