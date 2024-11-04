"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import AdminCoursePage from "@/components/AdminCoursePage";
import StudentCalendar from "@/components/StudentCalendar";
import InstructorCalendar from "@/components/InstructorScreens/InstructorCalendar";

export default function Page() {
  const [loader, setLoader] = useState(true);
  const { userData, isInstructor } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  // const isInstructor = Cookies.get("userGroup");

  // console.log(group);
  console.log(isInstructor);

  return (
    <>
      {isStudent ? (
        <StudentCalendar />
      ) : // : isAdmin ? (
      //   <AdminCoursePage title="Courses" route1="courses" route="course" />
      // )
      isInstructor ? (
        <>
          {" "}
          <InstructorCalendar />
        </>
      ) : (
        <div>No data found </div>
      )}
    </>
  );
}
