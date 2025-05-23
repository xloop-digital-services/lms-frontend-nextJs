"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentAttendence from "@/components/StudentAttendence";
import CourseHead from "@/components/CourseHead";
import { getStudentsByCourseId } from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";
import AdminAttendance from "@/components/AdminAttendance";
import AdminStudentGrading from "@/components/AdminStudentGrading";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const courseId = params.courseId;
  const [attendance, setAttendance] = useState([]);
  const [attendanceStudent, setAttendanceStudent] = useState([]);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const [loader, setLoader] = useState(false);
  const regId = userData?.user_data?.registration_id;
  useEffect(() => {
    if (!regId) return;
    async function fetchAttendance() {
      const response = await getStudentsByCourseId(courseId);
      setLoader(true);
      try {
        if (response.status === 200) {
          setAttendance(response.data);
          setLoader(false);
        } else {
          setLoader(false);
        }
      } catch (error) {
      }
    }

    fetchAttendance();
  }, []);

  return (
    <>
      {loader ? (
        <div className="flex h-screen justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div
          className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${
            isSidebarOpen
              ? "translate-x-64 ml-20 "
              : "translate-x-0 pl-10 pr-10 max-md:pl-2 max-md:pr-2"
          }`}
          style={{ width: isSidebarOpen ? "81%" : "100%" }}
        >
          <div className=" bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl  p-4">
            <CourseHead
              id={courseId}
              haveStatus={isStudent ? true : false}
              program="course"
            />
          
            <AdminStudentGrading courseId={courseId} />
          </div>
        </div>
      )}
    </>
  );
}
