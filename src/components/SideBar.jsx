"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSidebar } from "@/providers/useSidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { FaListCheck, FaLocationDot, FaMagnifyingGlass } from "react-icons/fa6";
import logo from "../../public/assets/img/logo.png";
import {
  FaBars,
  FaBookOpen,
  FaBullhorn,
  FaCalendar,
  FaClipboard,
  FaClipboardCheck,
  FaClipboardList,
  FaFile,
  FaHome,
  FaLaptopCode,
  FaListAlt,
  FaSignOutAlt,
  FaTasks,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "@/providers/AuthContext";

function SideBar() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { logOutUser, userData } = useAuth();
  const isAdmin = userData?.Group === "admin";
  const isStudent = userData?.Group === "student";
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const activeLinkRef = useRef(null);
  const isLinkActive = (path) => {
    return pathname === path || pathname.includes(path);
  };

  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [pathname]);

  const ToggleOptions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`fixed border border-solid border-blue-500 z-50 left-0 w-80 bg-blue-500 transition-transform font-inter ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex z-50 justify-between">
          <button
            className={`cursor-pointer text-surface-100 pl-4 max-md:pl-2 max-md:py-2 `}
            onClick={toggleSidebar}
          >
            <FaBars size={24} />
          </button>
          <Link href="/dashboard" className="mr-8" passHref>
            <Image
              src={logo}
              alt="logo"
              width={230}
              height={100}
              className="ml-8 my-1"
            />
          </Link>
        </div>
        <nav className="flex flex-col p-2 text-blue-500 sidebar bg-blue-500">
          <div className="flex flex-col h-screen">
            <div className="flex flex-col justify-between lg:h-[90%] h-[75%] overflow-y-auto scrollbar-webkit pb-4">
              <div className="py-4 rounded flex flex-col">
                <Link
                  href="/dashboard"
                  ref={isLinkActive("/dashboard") ? activeLinkRef : null}
                  className={`p-4 mx-3 flex gap-4 rounded-xl ${
                    isLinkActive("/dashboard")
                      ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                      : "text-dark-600 hover:text-blue-600 hover:bg-[#e6f8ff] hover:bg-opacity-40"
                  }`}
                >
                  <FaHome size={24} />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/announcement"
                    ref={isLinkActive("/announcement") ? activeLinkRef : null}
                    className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                      isLinkActive("/announcement")
                        ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                        : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                    }`}
                  >
                    <FaBullhorn size={24} />
                    Announcements
                  </Link>
                )}
                <div className={`${!isAdmin && "hidden"}`}>
                  <div
                    className={`p-4 mx-3 flex flex-col group gap-4 mt-2 cursor-pointer rounded-xl ${
                      isLinkActive("/user-management") ||
                      isLinkActive("/user-management/applicants") ||
                      isLinkActive("/user-management/users")
                        ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                        : "text-dark-600 hover:text-blue-600 hover:bg-[#e6f8ff] hover:bg-opacity-40"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between w-full ${
                        isOpen && "border-b border-dark-300 pb-2"
                      }`}
                      onClick={ToggleOptions}
                    >
                      <div className="flex gap-4">
                        <FaListCheck
                          size={24}
                          className={`${
                            isLinkActive("/user-management") ||
                            isLinkActive("/user-management/applicants") ||
                            isLinkActive("/user-management/users")
                              ? "text-blue-300 bg-blue-600"
                              : "bg-dark-600 text-[#07224d]"
                          } group-hover:text-[#07224da0] p-1 rounded-md group-hover:bg-blue-600`}
                        />
                        <p
                          className={`flex-grow text-center ${
                            isLinkActive("/user-management") && "font-semibold"
                          }`}
                        >
                          User Management
                        </p>
                      </div>
                      <button
                        className={`${
                          isOpen ? "rotate-180 duration-300" : "duration-300"
                        } group-hover:cursor-pointer`}
                      >
                        <IoIosArrowDown size={22} />
                      </button>
                    </div>

                    {isOpen && (
                      <div>
                        <ul className="flex flex-col list-disc pl-9 space-y-2 w-full">
                          <li className="w-full hover:font-semibold hover:text-blue-200">
                            <Link
                              href="/user-management/applicants"
                              ref={
                                isLinkActive("/user-management/applicants")
                                  ? activeLinkRef
                                  : null
                              }
                              className={`${
                                isLinkActive("/user-management/applicants") &&
                                "font-semibold"
                              } w-full block`}
                            >
                              Applicants
                            </Link>
                          </li>
                          <li className="w-full hover:font-semibold hover:text-blue-200">
                            <Link
                              href="/user-management/users"
                              ref={
                                isLinkActive("/user-management/users")
                                  ? activeLinkRef
                                  : null
                              }
                              className={`${
                                isLinkActive("/user-management/users") &&
                                "font-semibold"
                              } w-full block`}
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
                    ref={isLinkActive("/location") ? activeLinkRef : null}
                    className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                      isLinkActive("/location")
                        ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                        : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                    }`}
                  >
                    <FaLocationDot size={24} />
                    Location
                  </Link>
                  <Link
                    href="/batch"
                    ref={isLinkActive("/batch") ? activeLinkRef : null}
                    className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                      isLinkActive("/batch")
                        ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                        : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                    }`}
                  >
                    <FaListAlt size={24} />
                    Batch
                  </Link>
                  <Link
                    href="/class-scheduling"
                    ref={
                      isLinkActive("/class-scheduling") ? activeLinkRef : null
                    }
                    className={`p-4 mx-3 flex gap-4 group mt-2 rounded-xl  ${
                      isLinkActive("/class-scheduling")
                        ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                        : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                    }`}
                  >
                    <FaListCheck
                      size={24}
                      className={`${
                        isLinkActive("/class-scheduling")
                          ? " text-blue-300 bg-blue-600"
                          : " bg-dark-600 text-[#07224d]"
                      }  group-hover:text-[#07224da0] p-1 rounded-md  group-hover:bg-blue-600`}
                    />
                    Class Scheduling
                  </Link>
                  {/* <Link
                    href="/initial-screening-test"
                    ref={
                      isLinkActive("/initial-screening-test") ? activeLinkRef : null
                    }
                    className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                      isLinkActive("/initial-screening-test")
                        ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                        : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                    }`}
                  >
                    <FaMagnifyingGlass size={23} />
                    Initial Screening Test
                  </Link> */}
                </div>
                {/* <div className={`${isAdmin && "hidden"}`}> */}
                {(isAdmin || isStudent) && (
                  <Link
                    href="/programs"
                    ref={isLinkActive("/programs") ? activeLinkRef : null}
                    className={`p-4 mx-3 flex mt-2 gap-4 rounded-xl ${
                      isLinkActive("/programs")
                        ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                        : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                    }`}
                  >
                    <FaBookOpen size={24} />
                    Program
                  </Link>
                )}

                {/* </div> */}

                <Link
                  href="/courses"
                  ref={isLinkActive("/courses") ? activeLinkRef : null}
                  className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                    isLinkActive("/courses")
                      ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                      : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                  }`}
                >
                  <FaBookOpen size={24} />
                  Courses
                </Link>

                {/* <div className={`${isAdmin && "hidden"}`}> */}

                <Link
                  href="/assignment"
                  ref={isLinkActive("/assignment") ? activeLinkRef : null}
                  className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                    isLinkActive("/assignment")
                      ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                      : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                  }`}
                >
                  <FaTasks size={24} />
                  Assignment
                </Link>
                <Link
                  href="/quiz"
                  ref={isLinkActive("/quiz") ? activeLinkRef : null}
                  className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                    isLinkActive("/quiz")
                      ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                      : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                  }`}
                >
                  <FaClipboardList size={24} />
                  Quiz
                </Link>
                <Link
                  href="/project"
                  ref={isLinkActive("/project") ? activeLinkRef : null}
                  className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl  ${
                    isLinkActive("/project")
                      ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                      : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                  }`}
                >
                  <FaLaptopCode size={24} />
                  Project
                </Link>
                <Link
                  href="/exam"
                  ref={isLinkActive("/exam") ? activeLinkRef : null}
                  className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                    isLinkActive("/exam")
                      ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                      : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                  }`}
                >
                  <FaFile size={24} />
                  Exam
                </Link>
                <Link
                  href="/grading"
                  ref={isLinkActive("/grading") ? activeLinkRef : null}
                  className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                    isLinkActive("/grading")
                      ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                      : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                  }`}
                >
                  <FaClipboardCheck size={24} />
                  Grading
                </Link>
                <Link
                  href="/attendance"
                  ref={isLinkActive("/attendance") ? activeLinkRef : null}
                  className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                    isLinkActive("/attendance")
                      ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                      : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                  }`}
                >
                  <FaClipboard size={24} />
                  Attendance
                </Link>
                {!isStudent && (
                  <Link
                    href="/students"
                    ref={isLinkActive("/students") ? activeLinkRef : null}
                    className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                      isLinkActive("/students")
                        ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                        : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                    }`}
                  >
                    <FaUsers size={24} />
                    Students
                  </Link>
                )}

                {!isAdmin && (
                  <Link
                    href="/calendar"
                    ref={isLinkActive("/calendar") ? activeLinkRef : null}
                    className={`p-4 mx-3 flex gap-4 mt-2 rounded-xl ${
                      isLinkActive("/calendar")
                        ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                        : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                    }`}
                  >
                    <FaCalendar size={24} />
                    Calendar
                  </Link>
                )}
              </div>
              <div className="flex flex-col">
                <Link
                  href="/user/profile"
                  ref={isLinkActive("/user/profile") ? activeLinkRef : null}
                  className={`p-4 mx-3 flex gap-4 border rounded-xl border-dark-300  ${
                    isLinkActive("/user/profile")
                      ? "bg-blue-300 text-blue-600 hover:bg-opacity-60 hover:text-blue-300"
                      : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
                  }`}
                >
                  <FaUser size={24} />
                  Profile
                </Link>

                <Link
                  href="/auth/login"
                  onClick={logOutUser}
                  className={`p-4 mx-3 flex gap-4 mt-2 border rounded-xl border-dark-300  ${
                    isLinkActive("/auth/login")
                      ? "bg-blue-300 text-blue-600 hover:bg-opacity-60"
                      : "text-dark-600 hover:text-blue-600  hover:bg-[#e6f8ff] hover:bg-opacity-40"
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

      <button
        className={` fixed text-blue-500 px-4 py-4 max-md:px-2 max-md:py-2 focus:outline-none mt-4  ${
          isSidebarOpen && "hidden"
        } z-50`}
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>
    </>
  );
}

export default SideBar;
