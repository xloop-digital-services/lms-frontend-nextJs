"use client";
import React, { useEffect, useState } from "react";
import CoursePage from "@/components/CoursePage";
import { useAuth } from "@/providers/AuthContext";
import AdminCoursePage from "@/components/AdminCoursePage";
import InstructorCoursePage from "@/components/InstructorCoursePage";
import Cookies from "js-cookie";

export default function Page() {
  const [loader, setLoader] = useState(true);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  // const isInstructor = userData?.Group === "instructor";
  const isInstructor = Cookies.get("userGroup")

  // //console.log(group);
  //console.log(isInstructor);
  return (
    // <>
    //   {loader ? (
    //     <div className="flex h-screen justify-center items-center">
    //       <CircularProgress />
    //     </div>
    //   ) : (
    <>
      {isStudent ? (
        <CoursePage path="quiz" heading="Quizzes" />
      ) : isAdmin ? (
        <AdminCoursePage title="Quizzes" route="course" route1="quiz" />
      ) : isInstructor ? (
        <InstructorCoursePage title="Quizzes" route="course" route1="quiz" />
      ) : (
        <div>No data found </div>
      )}
    </>
    // )}
    // </>
  );
}
