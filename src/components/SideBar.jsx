"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import {
  FaBars,
  FaBookOpen,
  FaCalendar,
  FaClipboard,
  FaClipboardCheck,
  FaClipboardList,
  FaFile,
  FaHome,
  FaLaptopCode,
  FaSignOutAlt,
  FaTasks,
  FaUser,
  FaListAlt,
  FaUsers,
} from "react-icons/fa";

import { useAuth } from "@/providers/AuthContext";

function SideBar() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { logOutUser, userData } = useAuth();
  const isAdmin = userData?.Group === "admin";
  const isStudent = userData?.Group === "student";
  const pathname = usePathname();
  const isLinkActive = (path) => {
    return pathname === path || pathname.includes(path);
  };
  const [isOpen, setIsOpen] = useState(false);

  const ToggleOptions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`fixed border border-solid border-dark-100 left-0 w-80 bg-surface-100 py-5 transition-transform mt-20 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className={`cursor-pointer pl-4 max-md:pl-2 max-md:py-2 `}
          onClick={toggleSidebar}
        >
          <FaBars size={24} />
        </button>

        <nav className="flex flex-col mt-1 p-2 text-blue-500 sidebar ">
          <div className="flex flex-col h-screen">
            <div className=" flex flex-col justify-between lg:h-[80%] h-[75%] overflow-y-auto scrollbar-webkit pb-4">
              <div className=" py-4 rounded bg-surface-100 flex flex-col">
                <Link
                  href="/dashboard"
                  className={`p-4 flex gap-4 rounded-xl  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                    isLinkActive("/dashboard")
                      ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100 "
                      : "text-dark-600"
                  }`}
                >
                  <FaHome size={24} />
                  Dashboard
                </Link>
                <div className={`${!isAdmin && "hidden"}`}>
                  <div
                    className={`p-4 flex flex-col gap-4 mt-2 cursor-pointer rounded-xl hover:text-blue-300 ${
                      isLinkActive("/user-management") ||
                      isLinkActive("/user-management/approved") ||
                      isLinkActive("/user-management/shortlist")
                        ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                        : "text-dark-600"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between w-full ${
                        isOpen && "border-b border-dark-300 pb-2"
                      }`}
                      onClick={ToggleOptions}
                    >
                      <div className="flex gap-4">
                        <FaListAlt size={24} />
                        <p
                          className={`flex-grow text-center ${
                            isLinkActive("/user-management") && "font-semibold"
                          }`}
                        >
                          User Management
                        </p>
                      </div>
                      <button
                        // onClick={ToggleOptions}
                        className="group-hover:cursor-pointer"
                      >
                        <IoIosArrowDown size={22} />
                      </button>
                    </div>

                    {isOpen && (
                      <div>
                        <ul className="flex flex-col list-disc pl-9 space-y-2">
                          <li>
                            <Link
                              href="/user-management/applicants"
                              className={`${
                                isLinkActive("/user-management/applicants") &&
                                "font-semibold"
                              }`}
                            >
                              Applicants
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/user-management/users"
                              className={`${
                                isLinkActive("/user-management/users") &&
                                "font-semibold"
                              }`}
                            >
                              Verified Users
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <Link
                    href="/location"
                    className={`p-4  flex gap-4 mt-2 rounded-xl  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                      isLinkActive("/location")
                        ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                        : "text-dark-600"
                    }`}
                  >
                    <FaListAlt size={24} />
                    Location
                  </Link>
                  <Link
                    href="/batch"
                    className={`p-4  flex gap-4 mt-2 rounded-xl  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                      isLinkActive("/batch")
                        ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                        : "text-dark-600"
                    }`}
                  >
                    <FaListAlt size={24} />
                    Batch
                  </Link>
                  <Link
                    href="/session"
                    className={`p-4  flex gap-4 mt-2 rounded-xl  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                      isLinkActive("/session")
                        ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100 "
                        : "text-dark-600"
                    }`}
                  >
                    <FaListAlt size={24} />
                    Session
                  </Link>
                </div>
                {/* <div className={`${isAdmin && "hidden"}`}> */}
                {(isAdmin || isStudent) && (
                  <Link
                    href="/programs"
                    className={`p-4 flex gap-4 rounded-xl border-dark-300  hover:text-blue-300 ${
                      isLinkActive("/programs")
                        ? "text-blue-300 bg-blue-600 "
                        : "text-dark-600"
                    }`}
                  >
                    <FaBookOpen size={24} />
                    Program
                  </Link>
                )}

                {/* </div> */}

                <Link
                  href="/courses"
                  className={`p-4  flex gap-4 mt-2 rounded-xl hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                    isLinkActive("/courses")
                      ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                      : "text-dark-600"
                  }`}
                >
                  <FaBookOpen size={24} />
                  Courses
                </Link>

                {/* <div className={`${isAdmin && "hidden"}`}> */}
                <Link
                  href="/attendance"
                  className={`p-4  flex gap-4 mt-2 rounded-xl  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40  ${
                    isLinkActive("/attendance")
                      ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                      : "text-dark-600"
                  }`}
                >
                  <FaClipboard size={24} />
                  Attendance
                </Link>
                <Link
                  href="/quiz"
                  className={`p-4  flex gap-4 mt-2 rounded-xl hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                    isLinkActive("/quiz")
                      ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                      : "text-dark-600"
                  }`}
                >
                  <FaClipboardList size={24} />
                  Quiz
                </Link>
                <Link
                  href="/assignment"
                  className={`p-4  flex gap-4 mt-2 rounded-xl  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                    isLinkActive("/assignment")
                      ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                      : "text-dark-600"
                  }`}
                >
                  <FaTasks size={24} />
                  Assignment
                </Link>
                <Link
                  href="/project"
                  className={`p-4  flex gap-4 mt-2 rounded-xl  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                    isLinkActive("/project")
                      ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                      : "text-dark-600"
                  }`}
                >
                  <FaLaptopCode size={24} />
                  Project
                </Link>
                <Link
                  href="/exam"
                  className={`p-4 flex gap-4 mt-2 rounded-xl  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                    isLinkActive("/exam")
                      ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                      : "text-dark-600"
                  }`}
                >
                  <FaFile size={24} />
                  Exam
                </Link>
                <Link
                  href="/grading"
                  className={`p-4 flex gap-4 mt-2 rounded-xl  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                    isLinkActive("/grading")
                      ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                      : "text-dark-600"
                  }`}
                >
                  <FaClipboardCheck size={24} />
                  Grading
                </Link>
                {!isStudent && (
                  <Link
                    href="/students"
                    className={`p-4 flex gap-4 mt-2 rounded-xl  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                      isLinkActive("/students")
                        ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                        : "text-dark-600"
                    }`}
                  >
                    <FaUsers size={24} />
                    Students
                  </Link>
                )}
                <Link
                  href="/calendar"
                  className={`p-4  flex gap-4 mt-2 rounded-xl  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                    isLinkActive("/calendar")
                      ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                      : "text-dark-600"
                  }`}
                >
                  <FaCalendar size={24} />
                  Calendar
                </Link>
              </div>
              <div className="flex flex-col">
                <Link
                  href="/user/profile"
                  className={`p-4 flex gap-4 border rounded-xl border-dark-300  hover:text-blue-300 hover:bg-[#e6f8ff] hover:bg-opacity-40 ${
                    isLinkActive("/user/profile")
                      ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                      : "text-dark-600"
                  }`}
                >
                  <FaUser size={24} />
                  Profile
                </Link>

                <Link
                  href="/auth/login"
                  onClick={logOutUser}
                  className={`p-4 flex gap-4 mt-2 border rounded-xl border-dark-300 hover:text-blue-300 ${
                    isLinkActive("/auth/login")
                      ? "text-blue-300 bg-blue-600 hover:bg-blue-600 hover:bg-opacity-100"
                      : "text-dark-600"
                  }`}
                >
                  <FaSignOutAlt size={24} />
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* <div className="h-screen bg-surface-100 w-16"> */}
      <button
        className={`absolute  text-blue-500 px-4 py-4 max-md:px-2 max-md:py-2 focus:outline-none mt-4  ${
          isSidebarOpen && "hidden"
        } z-50`}
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>
      {/*         
        <div className="flex flex-col justify-between lg:h-[100%] h-[100%] overflow-y-auto ">
          <div className=" pt-40 rounded bg-surface-100 flex flex-col">
            <Link
              href="/dashboard"
              className={`m-1 p-4 flex gap-4 rounded-xl border-dark-300 ${
                isLinkActive("/dashboard")
                  ? "text-blue-300 bg-blue-600 "
                  : "text-dark-600"
              }`}
            >
              <FaHome size={24} />
            </Link>

            <Link
              href="/courses"
              className={`p-4 m-1 flex gap-4 mt-2 rounded-xl  ${
                isLinkActive("/courses")
                  ? "text-blue-300 bg-blue-600"
                  : "text-dark-600"
              }`}
            >
              <FaBookOpen size={24} />
             
            </Link>
            <Link
              href="/assignment"
              className={`p-4 m-1 flex gap-4 mt-2 rounded-xl  ${
                isLinkActive("/assignment")
                  ? "text-blue-300 bg-blue-600"
                  : "text-dark-600"
              }`}
            >
              <FaTasks size={24} />
            </Link>

            <Link
              href="/calendar"
              className={`p-4 m-1 flex gap-4 mt-2 rounded-xl  ${
                isLinkActive("/calendar")
                  ? "text-blue-300 bg-blue-600"
                  : "text-dark-600"
              }`}
            >
              <FaCalendar size={24} />
            </Link>
          </div>
          <div className="flex flex-col">
            <Link
              href="/user/profile"
              className={`p-4 m-1 flex gap-4 rounded-xl  ${
                isLinkActive("/user/profile")
                  ? "text-blue-300 bg-blue-600"
                  : "text-dark-600"
              }`}
            >
              <FaUser size={24} />
            </Link>

            <Link
              href="/auth/login"
              className={`p-4 flex m-1 gap-4 mt-2 rounded-xl ${
                isLinkActive("/auth/login")
                  ? "text-blue-300 bg-blue-600"
                  : "text-dark-600"
              }`}
            >
              <FaSignOutAlt size={24} />
            </Link>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default SideBar;
