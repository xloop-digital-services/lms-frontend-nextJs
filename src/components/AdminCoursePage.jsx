"use client";
import React, { useEffect, useRef, useState } from "react";
import CoursePage from "@/components/CoursePage";
import courseImg from "/public/assets/img/course-image.png";
import { useAuth } from "@/providers/AuthContext";
import CourseCard from "@/components/CourseCard";
import { getAllCourses, getAllPrograms, listAllSessions } from "@/api/route";
import { useSidebar } from "@/providers/useSidebar";
import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import GetAttendanceAdminTable from "./GetAttendanceAdminTable";
import useClickOutside from "@/providers/useClickOutside";
import Lottie from "lottie-react";
import bouncing from "../../public/data/bouncing.json";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function AdminCoursePage({ route1, programs, title, route }) {
  const { userData } = useAuth();

  const isAdmin = userData?.Group === "admin";
  const { isSidebarOpen } = useSidebar();
  const [sessions, setSessions] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loader, setLoading] = useState(false);
  const [toggleSession, setToggleSession] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const sessionDown = useRef(null);
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  // console.log(userData?.Group);

  useClickOutside(sessionDown, () => setIsSessionOpen(false));
  async function fetchAllCourses() {
    setLoading(true);
    try {
      const response = await getAllCourses();
      if (response.status === 200) {
        setCourses(response.data?.data);
      } else {
        // console.error("Failed to fetch courses, status:", response.status);
      }
    } catch (error) {
      // console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleListingAllSessions = async () => {
    setLoading(true);
    try {
      const response = await listAllSessions();
      // console.log("session fetching", response?.data);
      setSessions(response?.data.data);
    } catch (error) {
      // console.log(
      //   "error while fetching the class schedules",
      //   error.response.data.message
      // );
      if (error.message === "Network Error") {
        toast.error(error.message, "Check your internet connection");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && title === "Programs") return;
    fetchAllCourses();
  }, [isAdmin, title]);

  const handleSessionToggle = (session) => {
    setIsSessionOpen(true);
    setToggleSession(true);
    setSessionId(session.id);
  };

  const filteredPrograms = programs?.filter(
    (program) =>
      program.name.toLowerCase().includes(searchFilter.toLowerCase()) &&
      (statusFilter === "all" ||
        (statusFilter === "active" && program.status !== 0) ||
        (statusFilter === "inactive" && program.status === 0))
  );

  const filteredCourses = courses?.filter(
    (course) =>
      course.name.toLowerCase().includes(searchFilter.toLowerCase()) &&
      (statusFilter === "all" ||
        (statusFilter === "active" && course.status !== 0) ||
        (statusFilter === "inactive" && course.status === 0))
  );

  const hasResults =
    filteredPrograms?.length > 0 || filteredCourses?.length > 0;

  return (
    <div
      className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen
          ? "translate-x-64 ml-20 "
          : "translate-x-0 pl-10 pr-10 max-md:pl-2 max-md:pr-2"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "81%" : "100%",
      }}
    >
      <div className="bg-surface-100 p-8 rounded-xl max-md:p-4">
        <div className="flex justify-between max-md:flex-col max-md:items-center">
          <div className="flex flex-col">
            <div className="flex pb-2">
              <div
                className="text-dark-400 flex gap-2 items-center cursor-pointer hover:text-blue-300 mr-4"
                onClick={goBack}
              >
                <FaArrowLeft size={20} />
                {/* <p>Back</p> */}
              </div>
              <h2 className="font-exo text-xl max-md:text-center max-md:justify-center text-blue-500 font-bold flex justify-start items-center">
                {title}
              </h2>
            </div>
            <p className="pb-4 max-md:text-center max-md:justify-center">
              Select a scheduled class to view the {title}
            </p>
          </div>
          {route1 === "programs" || route1 === "courses" ? (
            <>
              <Link href={`/${route1}/create-a-${route}`}>
                <button className="flex justify-center max-sm:p-2 max-sm:rounded-md items-center gap-2  text-surface-100 bg-blue-300 p-4 rounded-xl mr-4  hover:bg-[#3272b6] max-sm:text-sm">
                  <FaPlus /> Create a New {route}
                </button>
              </Link>
            </>
          ) : null}
        </div>
        <div className="flex max-md:mt-2 max-md:flex-col gap-2 items-center">
          <div className="w-full">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-dark-300">
                <FaMagnifyingGlass size={18} />
              </span>
              <input
                className="w-full block  border-dark-200 focus:outline-blue-300 font-sans rounded-md border-0 py-1.5 pl-10 placeholder-dark-300 shadow-sm ring-1 ring-dark-300 focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                placeholder="Search here"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="w-40 flex items-center max-md:w-full">
            <select
              className="w-40 max-md:w-full py-[14px] bg-surface-100 block px-2 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {" "}
              <option value="" disabled>
                Select status
              </option>
              <option className="" value="all">
                All
              </option>
              <option className="" value="active">
                Active
              </option>
              <option className="" value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {loader ? (
          <div className="flex justify-center items-center h-[75vh]">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-wrap max-md:w-full max-sm:items-center max-sm:justify-center">
            {hasResults ? (
              <>
                {/* If both searchFilter and statusFilter are active, use filteredProgramsStatus and filteredCoursesStatus */}
                {filteredPrograms
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((program) => (
                    <CourseCard
                      key={program.id}
                      id={program.id}
                      courseName={program.name}
                      courseDesc={program.short_description}
                      image={courseImg}
                      route={route}
                      route1={route1}
                      status={program.status}
                    />
                  ))}
                {filteredCourses
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      courseName={course.name}
                      courseDesc={course.short_description}
                      image={courseImg}
                      route={route}
                      route1={route1}
                      chr={`${course.theory_credit_hours}+${course.lab_credit_hours}`}
                      status={course.status}
                    />
                  ))}
              </>
            ) : (
              <div className="text-center w-full mt-4 text-gray-500">
                <Lottie animationData={bouncing} className="h-[300px]" />
                <p className="font-bold text-blue-500">No results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
