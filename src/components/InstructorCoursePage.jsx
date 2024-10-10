"use client";
import MainCourseCard from "@/components/MainCourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React, { useContext, useEffect, useState } from "react";
import courseImg from "/public/assets/img/course-image.png";
import {
  getCourseByProgId,
  getCourses,
  getInstructorCourses,
  getProgressForCourse,
  getUserSessions,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";
import CourseCard from "./CourseCard";

export default function InstructorCoursePage({
  route1,
  programs,
  title,
  route,
}) {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const inInstructor = userData?.Group === "instructor";
  console.log(userData?.Group);
  const [courses, setCourses] = useState([]);
  const insId = userData?.user_data?.id;
  const insEmailId = userData?.User?.email;
  console.log(insEmailId);
  const [loader, setLoader] = useState(true);
  console.log(insId);
  // const [courseId, setCourseId] = useState();
  // useEffect(() => {
  //   if (!insId) return;
  //   async function fetchInstructorCourses() {
  //     const response = await getInstructorCourses(insId);
  //     setLoader(true);
  //     try {
  //       if (response.status === 200) {
  //         setCourses(response.data?.data?.courses);
  //         setLoader(false);
  //         // setCourseId(response?.data?.id)
  //         console.log(response?.data);
  //       } else {
  //         console.error("Failed to fetch user, status:", response.status);
  //       }
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   }

  //   inInstructor && fetchInstructorCourses();
  // }, [insId]);

  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoader(true);
    try {
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        const coursesData = sessions.map((session) => session.course);
        setCourses(coursesData);

        setLoader(false);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  useEffect(() => {
    fetchSessionForUser();
  }, []);

  console.log(courses);

  if (loader) {
    <CircularProgress />;
  }

  return (
    <div
      className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 pl-10 pr-10"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "81%" : "100%",
      }}
    >
      <div className="bg-surface-100 p-8 rounded-xl ">
        <div className="flex justify-between max-md:flex-col max-md:items-center ">
          <div className="flex flex-col">
            <h2 className="font-exo text-xl text-blue-500 font-bold flex pb-2 justify-start items-center">
              {title}
            </h2>
            <p className="pb-4">Select a course to view the {title}</p>
          </div>
        </div>
        {loader ? (
          <div className="flex justify-center items-center h-[75vh]">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-wrap max-md:flex-col">
            {courses?.length > 0
              ? courses
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((program) => (
                    <CourseCard
                      key={program.id}
                      id={program.id}
                      courseName={program.name}
                      courseDesc={program.short_description}
                      image={courseImg}
                      route={route}
                      route1={route1}
                      status={program.status}
                    />
                  ))
              : null}
          </div>
        )}
      </div>
    </div>
  );
}
