"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import StudentMarksTable from "./StudentMarksTable";
import { getAssignmentGrading, getQuizGrading } from "@/api/route";

export const GradingSection = ({ title, options, courseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [selected, setSelected] = useState(null);
  const [quizGrading, setQuizGrading] = useState([]);
  const [assignmentGrading, setAssignmentGrading] = useState([]);
  const [examGrading, setExamGrading] = useState([]);
  const [projectGrading, setProjectGrading] = useState([]);

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (id) => {
    setSelected(id);
    setIsOpen(false);
    if (!selected) return;

    // if (!selected && title === "Assignment") return;
    // fetchAsignmentsGrading();
  };

  useEffect(() => {
    // fetchQuizzesGrading();
    fetchAsignmentsGrading();
  }, [selected]);

  const handleToggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  async function fetchQuizzesGrading() {
    const response = await getQuizGrading(courseId, selected);
    try {
      if (response.status === 200) {
        setQuizGrading(response?.data?.data?.students);
        console.log(quizGrading);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchAsignmentsGrading() {
    const response = await getAssignmentGrading(courseId, selected);
    try {
      if (response.status === 200) {
        setAssignmentGrading(response?.data?.data?.students);
        console.log(assignmentGrading);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  // useEffect(() => {
  //   fetchQuizzesGrading();
  // });

  return (
    <div className="border my-3 border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
      <div
        className="flex justify-between items-center"
        onClick={() => handleToggleSection(title)}
      >
        <p className="text-[17px] font-semibold font-exo">{title}</p>
        <div className="flex gap-2 items-center">
          <div
            className={`transition-container ${
              openSection === title ? "max-height-full" : "max-height-0"
            }`}
          >
            {openSection === title && (
              <div className="z-20">
                <button
                  onClick={toggleOpen}
                  className="flex justify-between z-30 items-center min-w-[200px] text-[#92A7BE] hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-white border  border-[#92A7BE] rounded-lg  focus:outline-none  transition duration-300 ease-in-out"
                >
                  Select {title}
                  <span
                    className={`${
                      !isOpen ? "rotate-180 duration-300" : "duration-300"
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="absolute capitalize z-40 min-w-[200px] mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                    onClick={(e) => e.stopPropagation()} // This prevents the click event from propagating to parent elements
                  >
                    {options?.length > 0 ? (
                      options.map((option) => (
                        <div
                          key={option.id}
                          onClick={() => handleSelect(option.id)}
                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                            {option.question || option.title}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">No data found</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <span
            className={`${
              openSection ? "rotate-180 duration-300" : "duration-300"
            }`}
          >
            <IoIosArrowDown />
          </span>
        </div>
      </div>
      {selected && openSection && (
        <div className="mt-3">
          <StudentMarksTable assessments={assignmentGrading} />
        </div>
      )}
    </div>
  );
};
