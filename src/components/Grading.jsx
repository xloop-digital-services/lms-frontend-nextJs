"use client";
import React, { useState, useEffect } from "react";
import { GradingSection } from "./GradingSection";
import { getQuizByCourseId, getQuizGrading } from "@/api/route";

const Grading = ({ courseId }) => {
  // const quiz = ["quiz1", "quiz2", "quiz3", "quiz4"];
  // const assignments = ["assignment1", "assignment2"];
  // const exams = ["midterm", "final"];
  // const projects = ["project1", "project2", "project3"];

  const [quizzes, setQuizzes] = useState([]);
  const [quizGrading, setQuizGrading] = useState([]);
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

  async function fetchQuizzesGrading() {
    const response = await getQuizGrading(courseId, 1);
    try {
      if (response.status === 200) {
        setQuizGrading(response?.data?.data);
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
    fetchQuizzesGrading();
  }, []);

  return (
    <div className="">
      <GradingSection title="Quiz" options={quizzes} />
      {/* <GradingSection title="Assignments" options={assignments} />
      <GradingSection title="Exams" options={exams} />
      <GradingSection title="Projects" options={projects} /> */}
    </div>
  );
};

export default Grading;
