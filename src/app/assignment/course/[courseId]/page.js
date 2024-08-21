"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import {
  getAssignmentsByCourseId,
  getProgressForAssignment,
} from "@/api/route";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [assignments, setAssignments] = useState([]);
  const courseId = params.courseId;
  const [assignmentProgress, setAssignmentProgress] = useState({});

  console.log(courseId);

  async function fetchAssignments() {
    const response = await getAssignmentsByCourseId(courseId);
    try {
      if (response.status === 200) {
        setAssignments(response?.data?.data);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  async function fetchAssignmentProgress() {
    const response = await getProgressForAssignment(courseId);
    // setLoader(true);
    try {
      if (response.status === 200) {
        setAssignmentProgress(response?.data?.data);
        // setLoader(false);
        console.log(assignmentProgress);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  useEffect(() => {
    fetchAssignments();
    fetchAssignmentProgress();
  }, []);

  console.log("assignments here", assignments);
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
        <CourseHead
          id={courseId}
          rating="Top Instructor"
          instructorName="Maaz"
          progress={assignmentProgress?.progress_percentage}
          haveStatus={true}
        />

        <StudentDataStructure
          quizzes={assignments}
          key={assignments.id}
          field={"Assignment"}
          assessment="Assignments"
        />
      
      </div>
    </div>
  );
}
