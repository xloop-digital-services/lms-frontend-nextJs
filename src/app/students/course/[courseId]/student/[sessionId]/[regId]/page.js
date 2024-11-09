"use client";
import React from "react";
import { useSidebar } from "@/providers/useSidebar";
import CourseHead from "@/components/CourseHead";
import StudentGradingAdmin from "@/components/StudentGradingAdmin";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  // const regId = params.regId;
  const { courseId, sessionId, regId } = params;

  return (
    <div
      className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen
          ? "translate-x-64 ml-20 "
          : "translate-x-0 pl-10 pr-10 max-md:pl-2 max-md:pr-2"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "81%" : "100%",
      }}
    >
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <h2 className="text-2xl text-blue-500 flex items-center justify-center font-bold my-4 font-exo ">
          Student Overall Performance for the course{" "}
        </h2>
        <CourseHead
          id={courseId}
          // rating="Top Instructor"
          // instructorName="Maaz"
          // haveStatus={true}
          program="course"
        />
        <StudentGradingAdmin
          courseId={courseId}
          regId={regId}
          sessionId={sessionId}
        />
      </div>
    </div>
  );
}
