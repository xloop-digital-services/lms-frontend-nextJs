"use client";
import React, { useState, useEffect } from "react";
import { GradingSection } from "./GradingSection";
import {
  getAssignmentsByCourseId,
  getExamByCourseId,
  getProjectByCourseId,
  getQuizByCourseId,
  getQuizGrading,
  getWeightages,
} from "@/api/route";
import CreateWeightage from "./CreateWeightage";
import GetWeightage from "./GetWeightage";
import { useAuth } from "@/providers/AuthContext";

const Grading = ({ courseId }) => {
  // const quiz = ["quiz1", "quiz2", "quiz3", "quiz4"];
  // const assignments = ["assignment1", "assignment2"];
  // const exams = ["midterm", "final"];
  // const projects = ["project1", "project2", "project3"];
  const [loader, setLoader] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignWeightage, setAssignWeightage] = useState(false);
  const [weightage, setWeightage] = useState("");
  const [weightagesExist, setWeightagesExist] = useState(false);
  const { userData } = useAuth();
  const userId = userData?.User?.id;
  console.log(userId);
  const handleCreateWeightage = () => {
    setAssignWeightage(!assignWeightage);
  };

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
    const response = await getAssignmentsByCourseId(courseId, 1002);
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
  async function fetchWeightages() {
    const response = await getWeightages(courseId);
    setLoader(true);
    try {
      if (response.status === 200 && response?.data?.data?.length > 0) {
        setWeightagesExist(true);
        setWeightage(response?.data?.data);
        // console.log(response.data?.data?.[0]);
        // setLoader(false);
        // console.log(progress);
        // console.log(response.data);
      } else {
        setWeightagesExist(false);
        console.error("Failed to fetch weightages", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  const handleWeightageCreationSuccess = () => {
    fetchWeightages();
    setAssignWeightage(false);
  };
  useEffect(() => {
    fetchQuizzes();
    fetchAssignments();
    fetchExams();
    fetchProjects();
    fetchWeightages();
  }, []);

  console.log(weightage);
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
      <hr className="text-dark-200" />
      {/* <button
        onClick={handleCreateWeightage}
        className="bg-blue-300 from-dark-600 justify-end text-surface-100 p-2 rounded-md w-48 my-2 flex justify-center"
        type="submit"
      >
        {assignWeightage ? "Cancel" : "Assign Weightages"}
      </button>
      {assignWeightage && <CreateWeightage courseId={courseId} />} */}

      {weightagesExist ? (
        <div className="my-4">
          <GetWeightage weigh={weightage} />
        </div>
      ) : (
        <div className="my-4">
          <button
            onClick={handleCreateWeightage}
            className="bg-blue-300 from-dark-600 justify-end text-surface-100 p-2 rounded-md w-48 my-2 flex justify-center"
            type="submit"
          >
            {assignWeightage ? "Cancel" : "Assign Weightages"}
          </button>
          {assignWeightage && (
            <CreateWeightage
              courseId={courseId}
              onCreation={handleWeightageCreationSuccess}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Grading;
