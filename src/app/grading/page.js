"use client";
import React, { useEffect, useState } from "react";
import CoursePage from "@/components/CoursePage";
import { useAuth } from "@/providers/AuthContext";
import AdminCoursePage from "@/components/AdminCoursePage";
import InstructorCoursePage from "@/components/InstructorCoursePage";

export default function Page() {
  const [loader, setLoader] = useState(true);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
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
        // <CoursePage path="grading" heading="Grading" />
        <p className="flex justify-center items-center w-full h-full text-mix-200">Page is temperary closed!</p>
      ) : isAdmin ? (
        <AdminCoursePage title="Grading" route="course" route1="grading" />
      ) : isInstructor ? (
        <InstructorCoursePage title="Grading" route="course" route1="grading" />
      ) : (
        <div>No data found </div>
      )}
    </>
    // )}
    // </>
  );
}
