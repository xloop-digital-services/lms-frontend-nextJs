"use client";
import React, { useEffect, useState } from "react";
import CoursePage from "@/components/CoursePage";
import { useAuth } from "@/providers/AuthContext";
import AdminCoursePage from "@/components/AdminCoursePage";
import InstructorCoursePage from "@/components/InstructorCoursePage";
import { CircularProgress } from "@mui/material";

export default function Page() {
  const [loader, setLoader] = useState(false);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";

  return (
    <>
      {loader ? (
        <div className="absolute inset-0 w-full p-2 flex items-center justify-center  z-[1100]">
          <CircularProgress />
        </div>
      ) : (
        <>
          {isStudent ? (
            <CoursePage path="attendance" heading="Attendance" />
          ) : isAdmin ? (
            <AdminCoursePage
              title="Attendance"
              route="course"
              route1="attendance"
            />
          ) : isInstructor ? (
            <InstructorCoursePage
              title="Attendance"
              route="course"
              route1="attendance"
            />
          ) : (
            <div className="">No data found </div>
          )}
        </>
      )}
    </>
  );
}
