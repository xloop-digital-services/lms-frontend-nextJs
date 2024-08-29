"use client";
import React, { useEffect, useState } from "react";
import CoursePage from "@/components/CoursePage";
import { useAuth } from "@/providers/AuthContext";
import CourseCard from "@/components/CourseCard";
import { getAllPrograms } from "@/api/route";
import AdminCoursePage from "@/components/AdminCoursePage";

export default function Page() {
  const [loader, setLoader] = useState(true);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";

  console.log(userData?.Group);

  const [programs, setPrograms] = useState([]);
  // const [courseId, setCourseId] = useState();

  async function fetchAllPrograms() {
    const response = await getAllPrograms();
    try {
      
      if (response.status === 200) {
        setPrograms(response.data?.data);
        // setCourseId(response?.data?.id)
        // console.log(response?.data?.data?.[0]?.id)
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    fetchAllPrograms();
  }, []);

  return (
    <>
      {/* {loader ? (
        <div className="flex h-screen justify-center items-center">
          <CircularProgress />
        </div>
      ) : ( */}
      {isStudent ? (
        <div className="flex justify-center items-center h-screen w-full">
          <CoursePage path="courses" />
        </div>
      ) : isAdmin ? (
        <AdminCoursePage title="Programs" programs={programs} route="program" />
      ) : (
        <div className="flex justify-center items-center h-screen w-full">
          {" "}
          this is instructor
        </div>
      )}

      {/* )} */}
    </>
  );
}
