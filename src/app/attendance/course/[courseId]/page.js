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
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const router = useRouter();
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
          //console.log(attendance);
          //console.log(response.data);
        } else {
          //console.error("Failed to fetch courses", response.status);
          setLoader(false);
        }
      } catch (error) {
        //console.log("error", error);
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
          //console.log("student attendence", response.data.data.attendance);
          setAttendanceStudent(response.data.data.attendance);
          setLoader(false);
          //console.log(attendance);
          //console.log(response.data);
        } else {
          //console.error("Failed to fetch courses", response.status);
          setLoader(false);
        }
      } catch (error) {
        //console.log("error", error);
        setLoader(false);
      }
    }
    if (isStudent) {
      fetchAttendance();
    }
  }, [courseId, isStudent]);

  return (
    <>
      {loader ? (
        <div className="flex h-screen justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div
          className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-22 font-inter ${
            isSidebarOpen
              ? "translate-x-64 ml-20 "
              : "translate-x-0 pl-10 pr-10 max-md:pl-2 max-md:pr-2"
          }`}
          style={{ width: isSidebarOpen ? "81%" : "100%" }}
        >
          <div className="bg-surface-100 mx-4 my-3 px-6 pb-8 pt-6 rounded-xl p-4">
            <div
              className="text-dark-300 flex gap-2 items-center cursor-pointer pb-2 hover:text-blue-300 mr-4"
              onClick={() => router.push(`/attendance`)}
            >
              <FaArrowLeftLong size={20} />
              <p>Back</p>
            </div>
            {/* <CourseHead
              id={courseId}
              // rating="Top Instructor"
              program="course"
              instructorName="Maaz"
            /> */}
            {isStudent ? (
              <StudentAttendence
                isAdmin={isAdmin}
                attendance={attendanceStudent}
                loader={loader}
                courseId={courseId}
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
