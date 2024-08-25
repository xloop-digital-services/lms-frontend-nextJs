"use client";
import React, { useState } from "react";
import CoursePage from "@/components/CoursePage";
import { CircularProgress } from "@mui/material";

export default function Page() {
  const [loader, setLoader] = useState(true);
  return (
    <>
      {/* {loader ? (
        <div className="flex h-screen justify-center items-center">
          <CircularProgress />
        </div>
      ) : ( */}
        <CoursePage path="attendance" heading='Attendence' />
      {/* )} */}
    </>
  );
}
