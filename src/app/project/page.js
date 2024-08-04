"use client";
import MainCourseCard from "@/components/MainCourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React from "react";
import courseImg from "/public/assets/img/course-image.png";

export default function page() {
  const { isSidebarOpen } = useSidebar();
  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-44 font-inter ${
          isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
        }`}
        style={{
          // paddingBottom: "20px",
          width: isSidebarOpen ? "84%" : "100%",
        }}
      >
        <h2 className="text-xl font-bold">Courses</h2>
        <MainCourseCard
          courseImg={courseImg}
          courseName="UI/UX"
          courseDesc="Beginner's Guide to Becoming a Professional Backend Developer "
          progress="30%"
          durationOfCourse="6 Months"
          route="/project/courseId"
        />
        <MainCourseCard
          courseImg={courseImg}
          courseName="UI/UX"
          courseDesc="Beginner's Guide to Becoming a Professional Backend Developer "
          progress="50%"
          durationOfCourse="3 Months"
          route="/project/courseId"
        />
      </div>
    </>
  );
}
