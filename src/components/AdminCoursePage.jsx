"use client";
import React, { useEffect, useRef, useState } from "react";
import CoursePage from "@/components/CoursePage";
import courseImg from "/public/assets/img/course-image.png";
import { useAuth } from "@/providers/AuthContext";
import CourseCard from "@/components/CourseCard";
import { getAllCourses, getAllPrograms, listAllSessions } from "@/api/route";
import { useSidebar } from "@/providers/useSidebar";
import { FaEdit, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import GetAttendanceAdminTable from "./GetAttendanceAdminTable";
import useClickOutside from "@/providers/useClickOutside";

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
  const sessionDown = useRef(null);
  // //console.log(userData?.Group);

  useClickOutside(sessionDown, () => setIsSessionOpen(false));
  async function fetchAllCourses() {
    setLoading(true);
    try {
      const response = await getAllCourses();
      if (response.status === 200) {
        setCourses(response.data?.data);
      } else {
        //console.error("Failed to fetch courses, status:", response.status);
      }
    } catch (error) {
      //console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleListingAllSessions = async () => {
    setLoading(true);
    try {
      const response = await listAllSessions();
      // //console.log("session fetching", response?.data);
      setSessions(response?.data.data);
    } catch (error) {
      //console.log(
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

  return (
    <div
      className={`flex-1 transition-transform pt-[97px]  space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 pl-10 pr-10"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "81%" : "100%",
      }}
    >
      <div className="bg-surface-100 p-8 rounded-xl">
        <div className="flex justify-between max-md:flex-col max-md:items-center">
          <div className="flex flex-col">
          <h2 className="font-exo text-xl text-blue-500 font-bold flex pb-2 justify-start items-center">
              {title}
            </h2>
            <p className="pb-4">Select a scheduled class to view the {title}</p>
          </div>
          {route1 === "programs" || route1 === "courses" ? (
            <>
              <Link href={`/${route1}/create-a-${route}`}>
                <button className=" flex justify-center items-center gap-2  text-surface-100 bg-blue-300 p-4 rounded-xl mr-4  hover:bg-[#3272b6]">
                  <FaPlus /> Create a New {route}
                </button>
              </Link>
            </>
          ) : null}
        </div>
        {loader ? (
          <div className="flex justify-center items-center h-[75vh]">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-wrap max-md:w-full max-md:flex-col">
            {programs?.length > 0
              ? programs
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
                  ))
              : courses?.length > 0 &&
                courses
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
          </div>
        )}
        {/* <div className="">
          { loader ? (
            <div className="flex justify-center items-center h-[75vh]">
              <CircularProgress />
            </div>
          ) :   sessions && sessions.length > 0 ? (
            sessions.map((session, index) => (
              <div
                key={session.id}
                className="border border-dark-300 w-full p-4 mb-2 rounded-lg cursor-pointer flex flex-col"
              >
                <div className="flex  flex-col   items-center">
                  <div
                    className="flex gap-3 text-[17px] font-semibold font-exo items-center justify-between w-full"
                    onClick={() => handleSessionToggle(session)}
                  >
                    {session.location_name} - {session.course.name}
                    <span className="">
                      <IoIosArrowDown />
                    </span>
                  </div>
                </div>
                <div>
                  {isSessionOpen && sessionId === session.id && (
                    <div className="mt-3">

                      <GetAttendanceAdminTable sessionId={sessionId} />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-dark-300 p-2">
              no session found
            </p>
          )}
        </div> */}
      </div>
    </div>
  );
}
