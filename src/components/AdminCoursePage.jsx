"use client";
import React, { useEffect, useState } from "react";
import CoursePage from "@/components/CoursePage";
import courseImg from "/public/assets/img/course-image.png";
import { useAuth } from "@/providers/AuthContext";
import CourseCard from "@/components/CourseCard";
import { getAllPrograms } from "@/api/route";
import { useSidebar } from "@/providers/useSidebar";
import { FaEdit, FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function AdminCoursePage({ programs, title, route }) {
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const { isSidebarOpen } = useSidebar();

  console.log(userData?.Group);

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-28 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        width: isSidebarOpen ? "84%" : "100%",
      }}
    >
      <div className="flex justify-between ">
        <h2 className="text-xl font-bold flex justify-start items-center">{title}</h2>
        <Link href={`/${route}s/create-a-${route}`}  >
          <button className=" flex justify-center items-center gap-2  text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-[#4296b3]">
            <FaPlus /> Create a New {route}
          </button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        {programs?.map((program) => {
          return (
            <CourseCard
              key={program.id}
              id={program.id}
              courseName={program.name}
              courseDesc={program.short_description}
              image={courseImg}
              route={route}
              status={program.status}
            />
          );
        })}
      </div>
    </div>
  );
}
