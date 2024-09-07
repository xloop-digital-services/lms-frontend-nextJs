"use client";
import React, { useEffect, useState } from "react";
import CoursePage from "@/components/CoursePage";
import { useAuth } from "@/providers/AuthContext";
import CourseCard from "@/components/CourseCard";
import { getAllPrograms, getProgramById } from "@/api/route";
import AdminCoursePage from "@/components/AdminCoursePage";
import MainCourseCard from "@/components/MainCourseCard";
import StudentProgram from "@/components/StudentProgram";
import InstructorCoursePage from "@/components/InstructorCoursePage";

export default function Page() {
  const [loader, setLoader] = useState(true);
  const { userData } = useAuth();
  const progId = userData?.User?.program?.id;

  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";

  console.log(userData?.Group);
  console.log(progId);

  const [programs, setPrograms] = useState([]);
  const [program, setProgram] = useState([]);

  async function fetchAllPrograms() {
    const response = await getAllPrograms();
    try {
      if (response.status === 200) {
        setPrograms(response.data?.data);
      } else {
        console.error("Failed to fetch programs, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchProgrambyId() {
    const response = await getProgramById(progId);
    try {
      if (response.status === 200) {
        setProgram(response.data?.data);
        console.log(response.data?.data);
      } else {
        console.error("Failed to fetch program, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    fetchAllPrograms();
  }, []);

  useEffect(() => {
    if (isStudent) fetchProgrambyId();
  }, [progId]);

  return (
    // <>
    //   {loader ? (
    //     <div className="flex h-screen justify-center items-center">
    //       <CircularProgress />
    //     </div>
    //   ) : (
    <>
      {isStudent ? (
        <StudentProgram path="programs" heading="Registered Program" />
      ) : isAdmin ? (
        <AdminCoursePage
          title="Programs"
          programs={programs}
          route="program"
          route1="programs"
        />
      ) : isInstructor ? (
        <InstructorCoursePage title="Quizzes" route="course" route1="quiz" />
      ) : (
        <div>No data found </div>
      )}
    </>
    // )}
    // </>
  );
}
