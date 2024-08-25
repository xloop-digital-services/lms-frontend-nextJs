"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import { getProjectByCourseId } from "@/api/route";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [project, setProject] = useState([]);
  const courseId = params.courseId;

  // console.log(courseId);

  async function fetchProject() {
    const response = await getProjectByCourseId(courseId);
    try {
      if (response.status === 200) {
        setProject(response?.data?.data);
        console.log(project);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <div
    className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${
      isSidebarOpen
        ? "translate-x-64 pl-16 "
        : "translate-x-0 pl-10 pr-10"
    }`}
    style={{
      // paddingBottom: "20px",
      width: isSidebarOpen ? "86%" : "100%",
    }}
    >
      <div className=" bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl h-[85vh] p-4">
        <CourseHead
          id={courseId}
          rating="Top Instructor"
          instructorName="Maaz"
          haveStatus={true}
        />
        {/* {assignments?.map((assignment, index) => {
          return ( */}
        <StudentDataStructure
          quizzes={project}
          key={project.id}
          field="project"
          assessment="Project"
        />
        {/* );
        })} */}
      </div>
    </div>
  );
}
