"use client";
import MainCourseCard from "@/components/MainCourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React, { useContext, useEffect, useState } from "react";
import courseImg from "/public/assets/img/course-image.png";
import {
  getCourseByProgId,
  getCourses,
  getProgressForCourse,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";

export default function CoursePage({ path, progress }) {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const [courses, setCourses] = useState([]);
  const progId = userData?.session?.program;
  const [loader, setLoader] = useState(true);
  // console.log(progId)
  // const [courseId, setCourseId] = useState();
  useEffect(() => {
    if (!progId) return;
    async function fetchCourses() {
      const response = await getCourseByProgId(progId);
      setLoader(true);
      try {
        if (response.status === 200) {
          setCourses(response.data?.data);
          setLoader(false);
          // setCourseId(response?.data?.id)
          // console.log(response?.data?.data?.[0]?.id)
        } else {
          console.error("Failed to fetch user, status:", response.status);
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    fetchCourses();
  }, [progId]);

  if (loader) {
    <CircularProgress />;
  }

  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
          isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
        }`}
        style={{
          width: isSidebarOpen ? "84%" : "100%",
        }}
      >
        {loader ? (
          <div className="flex h-screen justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold">Courses</h2>
            {courses?.map((course) => {
              return (
                <MainCourseCard
                  key={course.id}
                  courseImg={courseImg}
                  courseName={course.name}
                  courseDesc={course.short_description}
                  // progress={courseProgress?.progress_percentage}
                  durationOfCourse={course.credit_hours}
                  route={`${path}/course/${course.id}`}
                />
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
