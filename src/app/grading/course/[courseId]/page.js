"use client";
import React, { useState, useRef, useEffect } from "react"; // Ensure useState is imported
import { IoIosArrowDown } from "react-icons/io"; // Import the icon
import PerformanceTable from "@/components/PerformanceTable";
import { useSidebar } from "@/providers/useSidebar";
import StudentMarksTable from "@/components/StudentMarksTable";
import CourseHead from "@/components/CourseHead";
import { getOverallProgress } from "@/api/route";
import { useAuth } from "@/providers/AuthContext";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [selectedOption, setSelectedOption] = useState("Hammad Siddiqui");
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [progress, setProgress] = useState({});
  const [loader, setLoader] = useState(true);
  const dropdownRef = useRef(null);
  const courseId = params.courseId;
  const { userData } = useAuth();
  const userId = userData?.user?.id;

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  async function fetchOverallProgress() {
    const response = await getOverallProgress(courseId, userId);
    // setLoader(true);
    try {
      if (response.status === 200) {
        setProgress(response.data);
        // setLoader(false);
        console.log(progress);
      } else {
        console.error("Failed to fetch courses", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    fetchOverallProgress();
  }, []);
  const options = [
    "Hammad Siddiqui",
    "Javeria Lodhi",
    "Sarah Patel",
    "Hira Fatima",
  ]; // Define your options

  async function fetchPendingAssignments() {
    const response = await getPendingAssignments(2, userId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setAssignments(response.data);
        setLoader(false);
        console.log(assignments);
      } else {
        console.error(
          "Failed to fetch pending assignments, status:",
          response.status
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  // useEffect(())

  const handleToggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <CourseHead
          id={courseId}
          rating="Top Instructor"
          instructorName="Maaz"
        />
        <div>
          {/* <div className='flex justify-between items-center'>
            <p className='text-[18px] font-semibold'>{selectedOption}</p>
            <div className="group relative inline-block w-64" ref={dropdownRef}>
              <button
                onClick={toggleOpen}
                className="w-full flex justify-between items-center text-[#92A7BE] group-hover:text-[#0e1721] px-4 py-4 text-sm text-left bg-white border border-[#92A7BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
              >
                {selectedOption || options[0]}
                <span className=''><IoIosArrowDown /></span>
              </button>

              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      className="p-2 cursor-pointer "
                    >
                      <div className='px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg'>
                        {option}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div> */}
          <div className="my-5 space-y-3">
            <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
              <div
                className=" flex justify-between items-center "
                onClick={() => handleToggleSection("Quiz")}
              >
                <p className="text-[17px] font-semibold font-exo">Quiz</p>
                <span className="">
                  <IoIosArrowDown />
                </span>
              </div>
              <div
                className={`transition-container ${
                  openSection === "Quiz" ? "max-height-full" : "max-height-0"
                }`}
              >
                {openSection === "Quiz" && (
                  <div className="mt-2">
                    <StudentMarksTable field={openSection} />
                  </div>
                )}
              </div>
            </div>

            <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
              <div
                className=" flex justify-between items-center "
                onClick={() => handleToggleSection("Assignment")}
              >
                <p className="text-[17px] font-semibold font-exo">Assignment</p>
                <span className="">
                  <IoIosArrowDown />
                </span>
              </div>
              <div
                className={`transition-container ${
                  openSection === "Assignment"
                    ? "max-height-full"
                    : "max-height-0"
                }`}
              >
                {openSection === "Assignment" && (
                  <div className="mt-2">
                    <StudentMarksTable field={openSection} />
                  </div>
                )}
              </div>
            </div>

            <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
              <div
                className=" flex justify-between items-center "
                onClick={() => handleToggleSection("Project")}
              >
                <p className="text-[17px] font-semibold font-exo">Project</p>
                <span className="">
                  <IoIosArrowDown />
                </span>
              </div>
              <div
                className={`transition-container ${
                  openSection === "Project" ? "max-height-full" : "max-height-0"
                }`}
              >
                {openSection === "Project" && (
                  <div className="mt-2">
                    <StudentMarksTable field={openSection} />
                  </div>
                )}
              </div>
            </div>

            <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
              <div
                className=" flex justify-between items-center "
                onClick={() => handleToggleSection("Exam")}
              >
                <p className="text-[17px] font-semibold font-exo">Exam</p>
                <span className="">
                  <IoIosArrowDown />
                </span>
              </div>
              <div
                className={`transition-container ${
                  openSection === "Exam" ? "max-height-full" : "max-height-0"
                }`}
              >
                {openSection === "Exam" && (
                  <div className="mt-2">
                    <StudentMarksTable field={openSection} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className={`transition-container ${
              openSection !== null ? "max-height-0" : "max-height-full"
            }`}
          >
            <div className={`font-semibold font-exo py-3 `}>
              Student Performance Overview
            </div>
            <PerformanceTable />
          </div>
        </div>
      </div>
    </div>
  );
}
