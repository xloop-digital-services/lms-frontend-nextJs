"use client";
import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { useAuth } from "@/providers/AuthContext";
import InstructorDashboard from "@/components/InstructorDashboard";

export default function Page() {
  const [loader, setLoader] = useState(true);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";

  // console.log(isStudent);
  // console.log(userData?.Group);

  return (
    <>
      {/* {loader ? (
        <div className="flex h-screen justify-center items-center">
          <CircularProgress />
        </div>
      ) : ( */}
      <>
        {isStudent ? (
          <StudentDashboard />
        ) : isAdmin ? (
          <AdminDashboard />
        ) : isInstructor ? (
          <InstructorDashboard />
        ) : (
          <div>No data found </div>
        )}
      </>
    </>
  );
}
