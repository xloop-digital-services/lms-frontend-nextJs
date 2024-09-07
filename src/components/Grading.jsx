"use client";
import React, { useState, useEffect } from "react";
import { GradingSection } from "./GradingSection";
import {
  getAssignmentsByCourseId,
  getExamByCourseId,
  getProjectByCourseId,
  getQuizByCourseId,
  getQuizGrading,
} from "@/api/route";

const Grading = ({ courseId }) => {
  // const quiz = ["quiz1", "quiz2", "quiz3", "quiz4"];
  // const assignments = ["assignment1", "assignment2"];
  // const exams = ["midterm", "final"];
  // const projects = ["project1", "project2", "project3"];

  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [projects, setProjects] = useState([]);

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

  async function fetchAssignments() {
    const response = await getAssignmentsByCourseId(courseId);
    try {
      if (response.status === 200) {
        setAssignments(response?.data?.data);
        console.log(quizzes);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchExams() {
    const response = await getExamByCourseId(courseId);
    try {
      if (response.status === 200) {
        setExams(response?.data?.data);
        console.log(quizzes);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchProjects() {
    const response = await getProjectByCourseId(courseId);
    try {
      if (response.status === 200) {
        setProjects(response?.data?.data);
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
    fetchAssignments();
    fetchExams();
    fetchProjects();
    // fetchQuizzesGrading();
  }, []);

  return (
    <div className="">
      <GradingSection title="Quiz" options={quizzes} courseId={courseId} />
      <GradingSection
        title="Assignment"
        options={assignments}
        courseId={courseId}
      />
      <GradingSection title="Exam" options={exams} courseId={courseId} />
      <GradingSection title="Project" options={projects} courseId={courseId} />
    </div>
  );
};

export default Grading;
