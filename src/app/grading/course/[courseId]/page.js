"use client";
import React, { useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import { useWindowSize } from "@/providers/useWindowSize";
import CourseHead from "@/components/CourseHead";
import { useAuth } from "@/providers/AuthContext";
import StudentGrading from "@/components/StudentGrading";
import Grading from "@/components/Grading";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const courseId = params.courseId;
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  return (
    <div
      className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 pl-10 pr-10 max-md:pl-2 max-md:pr-2"
      }`}
      style={{
        width: isSidebarOpen ? "81%" : "100%",
      }}
    >
        <div>
          {isStudent ? (
            <StudentGrading courseId={courseId} />
            // <p className="flex justify-center items-center w-full h-full text-mix-200">Page is temporary closed!</p>
          ) : (
            <Grading courseId={courseId} />
          )}
        </div>
      </div>
  );
}
