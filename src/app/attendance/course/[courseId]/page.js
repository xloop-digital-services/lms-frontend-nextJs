"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentAttendence from "@/components/StudentAttendence";
import CourseHead from "@/components/CourseHead";
import { getStudentAttendance } from "@/api/route";
import { useAuth } from "@/providers/AuthContext";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const courseId = params.courseId;
  const [attendance, setAttendance] = useState([]);
  const {userData} = useAuth();
  const regId = userData?.user_data?.registration_id;

  async function fetchAttendance() {
    const response = await getStudentAttendance(courseId, regId);
    // setLoader(true);
    try {
      if (response.status === 200) {
        setAttendance(response.data);
        // setLoader(false);
        console.log(attendance);
        console.log(response.data);
      } else {
        console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(()=>{
    fetchAttendance();
  },[])
  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-20 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "84%" : "100%",
      }}
    >
      <div className=" bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <CourseHead
          id={courseId}
          rating="Top Instructor"
          instructorName="Maaz"
        />

        <StudentAttendence attendance={attendance} />
      </div>
    </div>
  );
}
