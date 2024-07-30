"use client";
import { useSidebar } from "@/providers/useSidebar";
import React from "react";

export default function MainCourseCard() {
    const { isSidebarOpen } = useSidebar();
  return (
    <>
      <div
        className={`flex-1 transition-transform pt-28 max-md:pt-44  `}
        //     ${
        //   isSidebarOpen
        //     ? "translate-x-64 px-5 pl-16"
        //     : "translate-x-0 pl-10 pr-4"
        // }
       
        style={{
          paddingBottom: "20px",
        //   width: isSidebarOpen ? "84%" : "100%",
        }}
      >
        <div className="w-full bg-surface-100 h-60 rounded-xl m-5">fihfie</div>
      </div>
    </>
  );
}
