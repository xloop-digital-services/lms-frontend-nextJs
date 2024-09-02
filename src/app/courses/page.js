"use client";
import React, { useEffect, useState } from "react";
import CoursePage from "@/components/CoursePage";
import { useAuth } from "@/providers/AuthContext";
import CourseCard from "@/components/CourseCard";
import { getAllCourses } from "@/api/route";
import AdminCoursePage from "@/components/AdminCoursePage";
import { CircularProgress } from "@mui/material";

export default function Page() {
  const [loader, setLoader] = useState(true);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const [courses, setCourses] = useState([]);

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
    fetchAllCourses();
  }, []);

  return (
    <>
      {/* {loader ? (
        <div className="flex h-screen justify-center items-center">
          <CircularProgress />
        </div>
      ) : ( */}
        <>
          {isStudent ? (
            // <div className="">
              <CoursePage path="courses" heading="Courses" />
            // </div>
          ) : isAdmin ? (
            <AdminCoursePage title="Courses" programs={courses} route1="courses" route="course" />
          ) : (
            <div className="flex justify-center items-center h-screen w-full">
              this is instructor
            </div>
          )}
        </>
      {/* )} */}
    </>
  );
}
