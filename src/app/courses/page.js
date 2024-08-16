"use client";
import React, { useEffect, useState } from "react";
import CoursePage from "@/components/CoursePage";

export default function Page() {
  const [loader, setLoader] = useState(true);

  // console.log(courseProgress?.data?.progress_percentage)
  return (
    <>
      {/* {loader ? (
        <div className="flex h-screen justify-center items-center">
          <CircularProgress />
        </div>
      ) : ( */}
      <CoursePage
        path="courses"

      />
      {/* )} */}
    </>
  );
}
