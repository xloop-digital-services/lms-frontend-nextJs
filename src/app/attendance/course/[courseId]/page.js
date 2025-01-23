"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentAttendence from "@/components/StudentAttendence";
import { getAttendanceStudentPage, getStudentsByCourseId } from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";
import AdminAttendance from "@/components/AdminAttendance";
import { toast } from "react-toastify";
import InstructorAttendance from "@/components/InstructorAttendance";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const courseId = params.courseId;
  // const [attendance, setAttendance] = useState([]);
  const [attendanceStudent, setAttendanceStudent] = useState([]);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
  const [loader, setLoader] = useState(false);
  const regId = userData?.user_data?.registration_id;

  useEffect(() => {
    async function fetchAttendance() {
      setLoader(true);
      try {
        const response = await getAttendanceStudentPage(regId, courseId);
        if (response.status === 200) {
          // console.log("student attendence", response.data.data.attendance);
          setAttendanceStudent(response.data.data.attendance);

          console.log(attendanceStudent);
          setLoader(false);
          //console.log(response.data);
        } else {
          // console.error("Failed to fetch courses", response.status);
          setLoader(false);
        }
      } catch (error) {
        //console.log("error", error);
        setLoader(false);
      }
    }

    // if (!regId && courseId) return;
    if (isStudent && regId && courseId) {
      fetchAttendance();
    }
  }, [courseId, isStudent, regId, courseId]);

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
            {/* <CourseHead
              id={courseId}
              // rating="Top Instructor"
              program="course"
              instructorName="Maaz"
            /> */}
            {isStudent ? (
              <StudentAttendence
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
