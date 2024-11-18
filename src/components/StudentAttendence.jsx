"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import CourseHead from "./CourseHead";
import { useAuth } from "@/providers/AuthContext";
import { getUserSessions } from "@/api/route";
import StudentAttendanceTable from "./StudentAttendanceTable";

const StudentAttendence = ({ attendance, loader, isAdmin, courseId }) => {
  const { userData } = useAuth();
  // const courseId = params.courseId;
  const isStudent = userData?.Group === "student";
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [studentInstructorName, setStudentInstructorName] = useState(null);

  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoading(true);

    try {
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        //console.log(sessions);
        const coursesData = sessions.map((session) => {
          return {
            course: session.course,
            instructorName:
              session.instructor?.instructor_name || "To be Assigned",
          };
        });
        const foundSession = sessions.find(
          (session) => Number(session.course?.id) === Number(courseId)
        );

        if (isStudent && foundSession) {
          setSessionId(foundSession.id);
          setStudentInstructorName(
            foundSession.instructor?.instructor_name || "To be Assigned"
          );
        }
      } else {
        //console.error(
        //   "Failed to fetch user sessions, status:",
        //   response.status
        // );
      }
    } catch (error) {
      //console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessionForUser();
  }, [isStudent]);

  return (
    <>
      <CourseHead
        id={courseId}
        // rating="Top Instructor"
        program="course"
        instructorName={studentInstructorName ? studentInstructorName : ""}
      />

      <StudentAttendanceTable
        attendance={attendance}
        loader={loader}
        courseId={courseId}
      />
    </>
  );
};

export default StudentAttendence;
