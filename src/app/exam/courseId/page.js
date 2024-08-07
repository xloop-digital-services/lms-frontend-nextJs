"use client";
import { useSidebar } from "@/providers/useSidebar";
import React from "react";
import { FaFile, FaFilePdf } from "react-icons/fa";

export default function page({}) {
  const { isSidebarOpen } = useSidebar();
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
        <div className="flex flex-col">
          <div className="flex justify-between max-md:flex-col max-md:items-center">
            <h2 className="text-xl font-bold">
              Foundations of User Experience (UX) Design
            </h2>
            <p className="text-blue-300 font-bold ">Cr. hrs: 4(3-1)</p>
          </div>

          <p className="mt-2 mb-2 text-dark-500 max-md:text-center">
            This course is part of Google UX Design Professional Certificate
          </p>
        </div>
        <div className=" flex items-center mb-8 max-sm:flex-col">
          <div className="flex bg-[#EBF6FF] w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
            <p className="bg-[#03A1D8] w-2 h-2 rounded-full"></p>
            <p className="text-[#03A1D8] uppercase text-[12px] ">
              Top Instructor
            </p>
          </div>
          <p className="ml-2 flex items-center"> Instructor: Noor Ahmed</p>
        </div>
        <div className="bg-[#EBF6FF] w-full h-2 rounded-xl">
          <div
            className="bg-[#03A1D8] w-[120px] h-2 rounded-xl"
            style={{ width: "50%" }}
          ></div>
        </div>
        <hr className="my-12 text-dark-200"></hr>

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

        <hr className="my-8 text-dark-200"></hr>
        <div className="flex">
          <p> Time: 09:00 AM - 12:00 AM</p>
          <p className="text-dark-400 text-sm flex items-center px-4">
            {" "}
            Total Marks: 100
          </p>
        </div>
        <div className="flex mt-8">
          <button className="p-2 w-36 h-12 border bg-blue-300 text-surface-100 rounded-lg ">
            Download Exam
          </button>
          <button className="p-2 w-36 h-12 border text-blue-300 bg-surface-100 rounded-lg mx-2">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
