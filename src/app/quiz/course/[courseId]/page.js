"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import { getProgressForQuiz, getQuizByCourseId } from "@/api/route";
import StatusSummary from "@/components/StatusSummary";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [quizzes, setQuizzes] = useState([]);
  const courseId = params.courseId;
  const [quizProgress, setQuizProgress] = useState({});
  console.log(courseId);

  async function fetchQuizzes() {
    const response = await getQuizByCourseId(courseId);
    try {
      if (response.status === 200) {
        setQuizzes(response?.data?.data);
        console.log(quizzes);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchQuizProgress() {
    const response = await getProgressForQuiz(courseId);
    // setLoader(true);
    try {
      if (response.status === 200) {
        setQuizProgress(response?.data?.data);
        // setLoader(false);
        console.log(quizProgress);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    if (!courseId) return;
    fetchQuizzes();
    fetchQuizProgress();
  }, []);

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
          progress={quizProgress?.progress_percentage}
          haveStatus={true}
        />
        

        <StudentDataStructure
          quizzes={quizzes}
          key={quizzes.id}
          field={"Quiz"}
          assessment="Quiz"
        />
      </div>
    </div>
  );
}
