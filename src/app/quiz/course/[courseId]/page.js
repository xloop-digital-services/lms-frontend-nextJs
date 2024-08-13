"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import { getQuizByCourseId } from "@/api/route";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [quizzes, setQuizzes] = useState([]);
  const courseId = params.courseId;

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

  useEffect(() => {
    fetchQuizzes();
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
        />
        {/* {quizzes?.map((quiz, index) => { */}
        {/* return ( */}
        <StudentDataStructure
          quizzes={quizzes}
          key={quizzes.id}
          field={"Quiz"}
          assessment="Quiz"
          // assessmentNumber={`Quiz `}
          // status={quizzes.status === "1" ? "Active" : "Inactive"}
          // dueDate={quizzes.due_date}
          // remarks="-"
          // remarks={assignments.submissions
          //   ?.map((submission) =>
          //     submission.grading.map((grade) => grade.feedback)
          //   )
          //   .reduce((acc, feedbackArray) => acc.concat(feedbackArray), [])
          //   .join(", ")}
        />
        {/* ); */}
        {/* })} */}
      </div>
    </div>
  );
}
