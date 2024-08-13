"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import StudentDataStructure from "@/components/StudentDataStructure";
import CourseHead from "@/components/CourseHead";
import { getExamByCourseId } from "@/api/route";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [exam, setExam] = useState([]);
  const courseId = params.courseId;

  console.log(courseId);

  async function fetchExam() {
    const response = await getExamByCourseId(courseId);
    try {
      if (response.status === 200) {
        setExam(response?.data?.data);
        console.log(exam);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    fetchExam();
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

        <h2 className="text-xl font-bold mb-4">Exam instructions</h2>
        <ul className="text-dark-400 list-decimal">
          <li className="py-2 mx-4">
            Timing: Complete and submit your exam by the specified end time.
          </li>
          <li className="py-2 mx-4">
            Technical Requirements: Ensure a stable internet connection and use
            a compatible browser.
          </li>
          <li className="py-2 mx-4">
            Exam Environment: Find a quiet, distraction-free place to take the
            exam.{" "}
          </li>
          <li className="py-2 mx-4">
            Academic Integrity: Complete the exam independently without
            unauthorized assistance.
          </li>
          <li className="py-2 mx-4">
            Submission: Review and submit your answers before the deadline.
          </li>
          <li className="py-2 mx-4">
            Technical Issues: Contact support immediately if technical issues
            arise.
          </li>
          <li className="py-2 mx-4">
            Additional Instructions: Follow any additional instructions
            provided.
          </li>
        </ul>

        <hr className="my-8 text-dark-200 "></hr>
        <div className="flex mb-8">
          <p> Time: 09:00 AM - 12:00 AM</p>
          <p className="text-dark-400 text-sm flex items-center px-4">
            {" "}
            Total Marks: 100
          </p>
        </div>
        {/* <div className="flex mt-8">
          <button className="p-2 w-36 h-12 border bg-blue-300 text-surface-100 rounded-lg ">
            Download Exam
          </button>
          <button className="p-2 w-36 h-12 border text-blue-300 bg-surface-100 rounded-lg mx-2">
            Submit
          </button>
        </div> */}

        <StudentDataStructure
          quizzes={exam}
          key={exam.id}
          field={"Exam"}
          assessment="Exam"
        />
      </div>
    </div>
  );
}
