"use client";
import MainCourseCard from "@/components/MainCourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React, { useContext, useEffect, useState } from "react";
import courseImg from "/public/assets/img/course-image.png";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";
import { getUserSessions } from "@/api/route";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function CoursePage({ path, heading }) {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const [courses, setCourses] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();

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
        //console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  useEffect(() => {
    fetchSessionForUser();
  }, []);

  const goBack = () => {
    router.back();
  };

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
            <div className="flex items-center">
              <div
                className="text-dark-400 flex gap-2 items-center cursor-pointer hover:text-blue-300 mr-4"
                onClick={goBack}
              >
                <FaArrowLeft size={20} />
                {/* <p>Back</p> */}
              </div>
              <h2 className="text-xl text-blue-500 font-bold font-exo">
                {heading}
              </h2>
            </div>
            <p className="pb-6">Select a course to view the {heading}</p>
          </>
        )}
        <div className="flex flex-col w-full gap-4">
          {courses.map((course) => {
            // Find the session related to the current course
            const session = courses?.session?.find(
              (s) => s.course?.id === course.id
            );

            return (
              <MainCourseCard
                instructor={session?.instructor?.instructor_name} // Get the instructor name from the session
                key={course.id}
                courseImg={courseImg}
                courseName={course.name}
                courseDesc={course.short_description}
                durationOfCourse={`${course.theory_credit_hours}+${course.lab_credit_hours}`}
                route={`${path}/course/${course.id}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
