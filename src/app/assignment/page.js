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
        <CoursePage path="assignment" heading="Assignments" />
      ) : isAdmin ? (
        <AdminCoursePage
          title="Assignments"
          route="course"
          route1="assignment"
        />
      ) : isInstructor ? (
        <InstructorCoursePage
          title="Assignments"
          route="course"
          route1="assignment"
        />
      ) : (
        <div>No data found </div>
      )}
    </>
    // )}
    // </>
  );
}
