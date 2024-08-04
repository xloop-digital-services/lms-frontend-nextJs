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
        <hr className="my-8 text-dark-200"></hr>
        <div className="flex flex-col">
          <div className="flex justify-between max-md:flex-col">
            <h2 className="text-xl font-bold">About the Course</h2>
          </div>

          <p className="mt-2 mb-2 text-dark-500 text-justify">
            UX designers always put the user first. In this part of the course,
            you'll be introduced to user-centered design and one of the design
            frameworks that UX designers use on the job. You'll also learn about
            design best practices, including the importance of inclusive design
            and accessibility when designing. In addition, you'll learn how to
            think across platforms to design seamless user experiences.
          </p>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between max-md:flex-col mt-8 mb-4">
            <h2 className="text-xl font-bold">Skills You gain</h2>
          </div>

          <div className="flex gap-2 max-md:flex-col">
            <div className="flex bg-dark-800 w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
              <p className=" uppercase text-[12px] ">User Experience (UX)</p>
            </div>
            <div className="flex bg-dark-800 w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
              <p className=" uppercase text-[12px] ">Prototype</p>
            </div>
            <div className="flex bg-dark-800 w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
              <p className=" uppercase text-[12px] ">Wireframe</p>
            </div>
            <div className="flex bg-dark-800 w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
              <p className=" uppercase text-[12px] ">UX Research</p>
            </div>
            <div className="flex bg-dark-800 w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
              <p className="uppercase text-[12px] ">
                User Experience Design(UXD)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between max-md:flex-col mt-8 mb-4">
            <h2 className="text-xl font-bold">Modules</h2>
          </div>

          <div className="border border-dark-300 rounded-xl px-4">
            <p className="text-dark-300 my-4">Module 1</p>

            <p className="font-bold my-2">
              Introducing and Thinking like a UX Designer
            </p>
            <div className="flex items-center gap-2">
              <FaFilePdf size={16} fill="#03A1D8"/>
              <p className="flex items-center  text-blue-300 my-4">Slides.pdf</p>
            </div>
          </div>

          <div className="border border-dark-300 rounded-xl px-4">
            <p className="text-dark-300 my-4">Module 1</p>
            <p className="font-bold my-2">
              Introducing and Thinking like a UX Designer
            </p>
            <div className="flex items-center gap-2">
              <FaFilePdf size={16} fill="#03A1D8"/>
              <p className="flex items-center  text-blue-300 my-4">Slides.pdf</p>
            </div>
          </div>
          <div className="border border-dark-300 rounded-xl px-4">
            <p className="text-dark-300 my-4">Module 1</p>
            <p className="font-bold my-2">
              Introducing and Thinking like a UX Designer
            </p>
            <div className="flex items-center gap-2">
              <FaFilePdf size={16} fill="#03A1D8"/>
              <p className="flex items-center  text-blue-300 my-4">Slides.pdf</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
