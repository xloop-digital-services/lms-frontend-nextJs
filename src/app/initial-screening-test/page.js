"use client";
import QuizTestScreenTable from "@/components/QuizTestScreenTable";
import { useSidebar } from "@/providers/useSidebar";
import React, { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-22 font-inter pb-4 ${
        isSidebarOpen
          ? "translate-x-64 ml-20 "
          : "translate-x-0 sm:pl-5 px-4 sm:pr-5"
      }`}
      style={{
        width: isSidebarOpen ? "81%" : "100%",
      }}
    >
      <div className="bg-surface-100 p-6 rounded-xl space-y-4">
        <div>
          <p className="font-bold font-exo text-blue-500 text-xl">
            All Questions
          </p>
        </div>
        <div className="flex items-center w-full gap-2">
          <div className=" relative flex grow">
            {" "}
            {/* Ensure the container is growable */}
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-300">
              <FaMagnifyingGlass size={18} />
            </span>
            <div className="border py-3 border-dark-300 rounded-lg w-full">
              <input
                type="text"
                placeholder="Search questions"
                className="pl-9 px-3  text-sm  outline-none w-full" // w-full ensures full width
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="">
            <button
              className="text-[#fff] bg-blue-300 hover:bg-[#3272b6] sm:flex text-sm sm:p-4 px-3 py-3 md:px-6 rounded-lg hover:cursor-pointer"
              //   onClick={handleLocationCreat}
            >
              Uplaod questions
            </button>
          </div>
          <div>
            <button
              className="text-[#fff] bg-blue-300 hover:bg-[#3272b6] sm:flex text-sm sm:p-4 px-3 py-3 md:px-6 rounded-lg hover:cursor-pointer"
              //   onClick={handleLocationCreate}
            >
              Create a test
            </button>
          </div>
        </div>
        <div> 
            <QuizTestScreenTable />
        </div>
      </div>
    </div>
  );
}
