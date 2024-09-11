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

  return (
    // <>
    //   {loader ? (
    //     <div className="flex h-screen justify-center items-center">
    //       <CircularProgress />
    //     </div>
    //   ) : (
    <>
      {isStudent ? (
        <CoursePage path="students" heading="Students" />
      ) : isAdmin ? (
        <AdminCoursePage title="Students" route="course" route1="students" />
      ) : isInstructor ? (
        <InstructorCoursePage
          title="Students"
          route="course"
          route1="students"
        />
      ) : (
        <div>No data found </div>
      )}
    </>
    // )}
    // </>
  );
}
