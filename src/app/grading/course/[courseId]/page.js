"use client";
import React, { useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import { useWindowSize } from "@/providers/useWindowSize";
import CourseHead from "@/components/CourseHead";
import { useAuth } from "@/providers/AuthContext";
import StudentGrading from "@/components/StudentGrading";
import Grading from "@/components/Grading";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const courseId = params.courseId;
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  return (
    <div
      className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-16 " : "translate-x-0 pl-10 pr-10"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "86%" : "100%",
      }}
    >
      <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
        <CourseHead
          id={courseId}
          rating="Top Instructor"
          instructorName="Maaz"
          haveStatus={true}
          program="course"
        />
        <div>
          {/* NOTIFICATION CODE */}

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

          {isStudent ? (
            <StudentGrading courseId={courseId} />
          ) : (
            <Grading courseId={courseId} />
          )}

          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
