"use client";
import MainCourseCard from "@/components/MainCourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React, { useContext, useEffect, useState } from "react";
import courseImg from "/public/assets/img/course-image.png";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";

export default function CoursePage({ path, heading }) {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const [courses, setCourses] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (userData?.session) {
      const sessionCourses = userData?.session?.map(
        (session) => session.course
      );
      setCourses(sessionCourses);
      setLoader(false);
    } else {
      setLoader(true);
    }
  }, [userData]);

  if (loader) {
    return (
      <div className="flex h-screen justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 ml-20" : "translate-x-0 pl-10 pr-10"
      }`}
      style={{
        width: isSidebarOpen ? "81%" : "100%",
      }}
    >
      <div className="bg-surface-100 p-8 rounded-xl">
        {!(heading === "program") && (
          <>
            <h2 className="text-xl font-bold pb-1 font-exo">{heading}</h2>
            <p className="pb-6">Select a course to view the {heading}</p>
          </>
        )}
        <div className="flex flex-col w-full gap-4">
          {courses.map((course) => (
            <MainCourseCard
              key={course.id}
              courseImg={courseImg}
              courseName={course.name}
              courseDesc={course.short_description}
              durationOfCourse={`${course.theory_credit_hours}+${course.lab_credit_hours}`}
              route={`${path}/course/${course.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
