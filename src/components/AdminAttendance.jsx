"use client";
import { useSidebar } from "@/providers/useSidebar";
import React from "react";
import Table from "./Table";
import CourseHead from "./CourseHead";

export default function AdminAttendance({courseId}) {
  return (
    <div className=" bg-surface-100  rounded-xl h-[85vh]">
      <Table courseId={courseId}/>
    </div>
  );
}
