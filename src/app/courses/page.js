"use client";
import React, { useEffect, useState } from "react";
import CoursePage from "@/components/CoursePage";
import { useAuth } from "@/providers/AuthContext";
import AdminCoursePage from "@/components/AdminCoursePage";
import InstructorCoursePage from "@/components/InstructorCoursePage";
import Cookies from "js-cookie";

export default function Page() {
  const [loader, setLoader] = useState(true);
  const { userData,isInstructor } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  // const isInstructor = Cookies.get("userGroup");

  // console.log(group);
  console.log(isInstructor);

  return (
    // <>
    //   {loader ? (
    //     <div className="flex h-screen justify-center items-center">
    //       <CircularProgress />
    //     </div>
    //   ) : (
    <>
      {isStudent ? (
        <CoursePage path="courses" heading="Courses" />
      ) : isAdmin ? (
        <AdminCoursePage title="Courses" route1="courses" route="course" />
      ) : isInstructor ? (
        <>
          {/* <h2 className="h-[100vh] bg-blue-300"></h2> */}
          <InstructorCoursePage
            title="Courses"
            route1="courses"
            route="course"
          />
        </>
      ) : (
        <div>No data found </div>
      )}
    </>
    // )}
    // </>
  );
}
