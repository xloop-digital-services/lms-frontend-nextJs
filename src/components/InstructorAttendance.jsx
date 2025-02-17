"use client";
import { useSidebar } from "@/providers/useSidebar";
import React from "react";
import Table from "./Table";
import CourseHead from "./CourseHead";
import GetAttendanceTable from "./GetAttendanceTable";

export default function InstructorAttendance({ courseId }) {
  //console.log(courseId);
  return (
    <div className=" bg-surface-100  rounded-xl ">
      <CourseHead
        id={courseId}
        // rating="Top Instructor"
        program="course"
        instructorName="Maaz"
      />
      <GetAttendanceTable courseId={courseId} />
    </div>
  );
}
