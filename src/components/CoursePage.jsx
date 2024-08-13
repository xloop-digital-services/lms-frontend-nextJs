"use client";
import MainCourseCard from "@/components/MainCourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React, { useContext, useEffect, useState } from "react";
import courseImg from "/public/assets/img/course-image.png";
import { getAllCourses, getCourses } from "@/api/route";
import { useAuth } from "@/providers/AuthContext";

export default function CoursePage({ path }) {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();

  const isStudent = userData?.Group === "student";

  const [courses, setCourses] = useState([]);

  async function fetchCourses() {
    const response = await getAllCourses();
    try {
      if (response.status === 200) {
        setCourses(response.data);
        // console.log(courses);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-44 font-inter ${
          isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
        }`}
        style={{
          width: isSidebarOpen ? "84%" : "100%",
        }}
      >
        <h2 className="text-xl font-bold">Courses</h2>
        {courses?.data?.map((course) => {
          return (
            <MainCourseCard
              key={course.id}
              courseImg={courseImg}
              courseName={course.name}
              courseDesc={course.short_description}
              // progress="30%"
              durationOfCourse={course.credit_hours}
              route={`${path}/course/${course.id}`}
            />
          );
        })}
      </div>
    </>
  );
}
