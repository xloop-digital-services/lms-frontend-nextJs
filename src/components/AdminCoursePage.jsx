"use client";
import React, { useEffect, useState } from "react";
import CoursePage from "@/components/CoursePage";
import courseImg from "/public/assets/img/course-image.png";
import { useAuth } from "@/providers/AuthContext";
import CourseCard from "@/components/CourseCard";
import { getAllCourses, getAllPrograms } from "@/api/route";
import { useSidebar } from "@/providers/useSidebar";
import { FaEdit, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { CircularProgress } from "@mui/material";

export default function AdminCoursePage({ route1, programs, title, route }) {
  const { userData } = useAuth();

  const isAdmin = userData?.Group === "admin";
  const { isSidebarOpen } = useSidebar();
  const [courses, setCourses] = useState([]);
  const [loader, setLoader] = useState(false);

  console.log(userData?.Group);

  async function fetchAllCourses() {
    setLoader(true);
    try {
      const response = await getAllCourses();
      if (response.status === 200) {
        setCourses(response.data?.data);
      } else {
        console.error("Failed to fetch courses, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    isAdmin && fetchAllCourses();
  }, []);

  return (
    <div
      className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-10"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "85%" : "100%",
      }}
    >
      <div className="bg-surface-100 p-8 rounded-xl ">
        <div className="flex justify-between max-md:flex-col max-md:items-center ">
          <div className="flex flex-col">
            <h2 className="font-exo text-xl font-bold flex pb-2 justify-start items-center">
              {title}
            </h2>
            <p className="pb-4">Select a course to view the {title}</p>
          </div>
          {route1 === "programs" || route1 === "courses" ? (
            <>
              <Link href={`/${route1}/create-a-${route}`}>
                <button className=" flex justify-center items-center gap-2  text-surface-100 bg-blue-300 p-4 rounded-xl mr-4  hover:bg-[#4296b3]">
                  <FaPlus /> Create a New {route}
                </button>
              </Link>
            </>
          ) : null}
        </div>
        {loader ? (
          <div className="flex justify-center items-center h-[75vh]">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-wrap max-md:w-full max-md:flex-col">
            {programs?.length > 0
              ? programs
                  ?.sort((a, b) => a.name.localeCompare(b.name))
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
              : courses?.length > 0 &&
                courses
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      courseName={course.name}
                      courseDesc={course.short_description}
                      image={courseImg}
                      route={route}
                      route1={route1}
                      status={course.status}
                    />
                  ))}
          </div>
        )}
      </div>
    </div>
  );
}
