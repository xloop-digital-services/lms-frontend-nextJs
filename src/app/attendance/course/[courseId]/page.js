"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentAttendence from "@/components/StudentAttendence";
import CourseHead from "@/components/CourseHead";
import { getStudentAttendance, getStudentsByCourseId } from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";
import AdminAttendance from "@/components/AdminAttendance";
import { toast } from "react-toastify";
import InstructorAttendance from "@/components/InstructorAttendance";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const courseId = params.courseId;
  const [attendance, setAttendance] = useState([]);
  const [attendanceStudent, setAttendanceStudent] = useState([]);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
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
          console.log(attendance);
          console.log(response.data);
        } else {
          console.error("Failed to fetch courses", response.status);
          setLoader(false);
        }
      } catch (error) {
        console.log("error", error);
        setLoader(false);
      }
    }

    fetchAttendance();
  }, []);

  useEffect(() => {
    async function fetchAttendance() {
      setLoader(true);
      try {
        const response = await getStudentAttendance(courseId);
        if (response.status === 200) {
          console.log("student attendence", response.data.data.attendance);
          setAttendanceStudent(response.data.data.attendance);
          setLoader(false);
          console.log(attendance);
          console.log(response.data);
        } else {
          console.error("Failed to fetch courses", response.status);
          setLoader(false);
        }
      } catch (error) {
        console.log("error", error);
        setLoader(false);
      }
    }
    if (isStudent) {
      fetchAttendance();
    }
  }, [courseId]);

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
              ? "translate-x-64 pl-16 "
              : "translate-x-0 pl-10 pr-10"
          }`}
          style={{
            // paddingBottom: "20px",
            width: isSidebarOpen ? "86%" : "100%",
          }}
        >
          <div className=" bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl  p-4">
            <CourseHead
              id={courseId}
              rating="Top Instructor"
              program="course"
              instructorName="Maaz"
            />
            {isStudent ? (
              <StudentAttendence
                attendance={attendanceStudent}
                loader={loader}
              />
            ) : isAdmin ? (
              <AdminAttendance courseId={courseId} />
            ) : isInstructor ? (
              <InstructorAttendance courseId={courseId} />
            ) : (
              <div>No group</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
