"use client";
import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { useAuth } from "@/providers/AuthContext";

export default function Page() {
  const [loader, setLoader] = useState(true);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  console.log(isStudent)
  console.log(userData?.Group)

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
            <StudentDashboard />
          // </div>
        ) : isAdmin ? (
          <AdminDashboard />
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
