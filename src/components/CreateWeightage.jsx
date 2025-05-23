"use client";
import {
  assignWeightages,
  getOverallProgress,
  getWeightages,
} from "@/api/route";
import React, { useState } from "react";
import { toast } from "react-toastify";

export const sum = (a, b, c, d, e) => {
  return (
    parseFloat(a || 0) +
    parseFloat(b || 0) +
    parseFloat(c || 0) +
    parseFloat(d || 0) +
    parseFloat(e || 0)
  );
};

export default function CreateWeightage({ courseId, onCreation, sessionId }) {
  const [assignmentsWeightage, setAssignmentsWeightage] = useState("");
  const [quizzesWeightage, setQuizzesWeightage] = useState("");
  const [projectsWeightage, setProjectsWeightage] = useState("");
  const [examsWeightage, setExamsWeightage] = useState("");
  const [attenWeightage, setAttenWeightage] = useState("");
  const [loader, setLoader] = useState(false);
  async function handleSubmitWeightage() {
    const totalWeightage = sum(
      quizzesWeightage,
      assignmentsWeightage,
      projectsWeightage,
      examsWeightage,
      attenWeightage
    );

    if (totalWeightage !== 100) {
      toast.error("Total weightage must be exactly 100%");
      return;
    }

    const data = {
      course: courseId,
      assignments_weightage: assignmentsWeightage,
      quizzes_weightage: quizzesWeightage,
      projects_weightage: projectsWeightage,
      exams_weightage: examsWeightage,
      attendance_weightage: attenWeightage,
      session: sessionId,
    };

    try {
      if (!sessionId) {
        toast.error("Select a session to assign the weightages.");
        return;
      }

      const response = await assignWeightages(data);
      if (response.status === 200 || response.status === 201) {
        toast.success(
          "Weightages Created successfully",
          response?.data?.message
        );
        setExamsWeightage("");
        setAssignmentsWeightage("");
        setProjectsWeightage("");
        setQuizzesWeightage("");
        setAttenWeightage("");
        if (onCreation) {
          onCreation();
        }
      } else {
        toast.error(
          "Error creating weightages",
          response?.data?.message || "Unknown error occurred"
        );
      }
    } catch (error) {
      toast.error(
        "Error creating weightages",
        error?.response?.data?.message || "An error occurred"
      );
    }
  }

  return (
    <div>
      <h2 className="text-lg my-4 font-exo text-blue-500 font-bold">
        {" "}
        Weightages
      </h2>

      <div className="my-3">
        <label>Quiz Weightage</label>
        <input
          type="number"
          placeholder="Enter weightage for assignment"
          min={0}
          value={quizzesWeightage}
          onChange={(e) => setQuizzesWeightage(e.target.value)}
          className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
        />
      </div>
      <div className="my-3">
        <label>Assignment Weightage</label>
        <input
          type="number"
          min={0}
          value={assignmentsWeightage}
          onChange={(e) => setAssignmentsWeightage(e.target.value)}
          placeholder="Enter weightage for assignment"
          className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
        />
      </div>
      <div className="my-3">
        <label>Project Weightage</label>
        <input
          placeholder="Enter weightage for project"
          type="number"
          min={0}
          value={projectsWeightage}
          onChange={(e) => setProjectsWeightage(e.target.value)}
          className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
        />
      </div>
      <div className="my-3">
        <label>Exam Weightage</label>
        <input
          type="number"
          min={0}
          value={examsWeightage}
          onChange={(e) => setExamsWeightage(e.target.value)}
          placeholder="Enter weightage for exam"
          className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
        />
      </div>

      <div className="my-3">
        <label>Attendance Weightage</label>
        <input
          type="number"
          min={0}
          value={attenWeightage}
          onChange={(e) => setAttenWeightage(e.target.value)}
          placeholder="Enter weightage for attendance"
          className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
        />
      </div>
      <div>
        <p>
          TOTAL WEIGHTAGE:{" "}
          {sum(
            quizzesWeightage,
            assignmentsWeightage,
            projectsWeightage,
            examsWeightage,
            attenWeightage
          )}
          %
        </p>
      </div>
      <button
        onClick={handleSubmitWeightage}
        className="bg-blue-300 hover:bg-[#3272b6] from-dark-600 justify-end text-surface-100 p-2 rounded-md w-20 my-2 flex justify-center"
        type="submit"
      >
        Submit
      </button>
    </div>
  );
}
