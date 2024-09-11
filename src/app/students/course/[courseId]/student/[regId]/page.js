"use client";
import React from "react";
import StudentGrading from "@/components/StudentGrading";
import { useSidebar } from "@/providers/useSidebar";
import CourseHead from "@/components/CourseHead";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  // const regId = params.regId;
  const { courseId, regId } = params;
  return (
    <div
      className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-16 " : "translate-x-0 pl-10 pr-10"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "86%" : "100%",
      }}
    >
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <h2 className="text-2xl flex items-center justify-center font-bold my-4 font-exo ">
          Student Overall Performance for the course{" "}
        </h2>
        <CourseHead
          id={courseId}
          rating="Top Instructor"
          instructorName="Maaz"
          haveStatus={true}
        />
        <StudentGrading courseId={courseId} regId={regId} />
      </div>
    </div>
  );
}
