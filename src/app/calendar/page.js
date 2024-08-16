"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import React from "react";
import { useSidebar } from "@/providers/useSidebar";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
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
      <div className="bg-surface-100 p-4 rounded-xl">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={[
            { title: "Assignment Submission", date: "2024-08-22" },
            { title: "Mobile Application Development", date: "2024-08-10" },
          ]}
        />
      </div>
    </div>
  );
}
