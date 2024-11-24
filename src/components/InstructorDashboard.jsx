"use client";
import AssignmentCard from "@/components/AssignmentCard";
import CourseCard from "@/components/CourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React, { useEffect, useState } from "react";
import image1 from "/public/assets/img/course-image.png";
import { MdArrowRightAlt } from "react-icons/md";
import Link from "next/link";
import { useAuth } from "@/providers/AuthContext";
import {
  getCalendarData,
  getCalendarInstructor,
  getInstructorSessions,
  getUserSessions,
} from "@/api/route";
import { CircularProgress } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function InstructorDashboard() {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loader, setLoader] = useState(true);
  const isStudent = userData?.Group === "student";
  const group = userData?.Group;
  const userId = userData?.User?.id;
  const insId = userData?.user_data?.id;
  const [calendarEvents, setCalendarEvents] = useState([]);
  const insEmailId = userData?.User?.email;

  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoader(true);
    try {
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        const coursesData = sessions.map((session) => session.course);
        setCourses(coursesData);

        setLoader(false);
      }
    } catch (error) {
      //console.log("Error:", error);
    }
  }

  useEffect(() => {
    fetchSessionForUser();
  }, []);

  async function fetchPendingAssignments() {
    const response = await getInstructorSessions(userId, group);
    setLoader(true);
    try {
      if (response.status === 200) {
        setSessions(response.data);
        setLoader(false);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }

  async function fetchCalendarSessions() {
    const response = await getCalendarInstructor(userId);
    try {
      if (response.status === 200) {
        const events = Array.isArray(response?.data?.data)
          ? response.data?.data?.flatMap((item) =>
              Array.isArray(item.sessions)
                ? item?.sessions?.map((session) => ({
                    title: session.course_name,
                    start: `${item.date}T${session.start_time}`,
                    end: `${item.date}T${session.end_time}`,
                    description: `Location: ${session.location}`,
                  }))
                : []
            )
          : [];

        setCalendarEvents(events);
      }
    } catch (error) {
      //console.error("Error fetching calendar data", error);
    }
  }

  const courseLimit = isSidebarOpen ? 2 : 3;

  useEffect(() => {
    fetchPendingAssignments();
    if (!userId) return;
    fetchCalendarSessions();
  }, [userId, group]);

  return (
    <>
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
        {" "}
        <div className="flex w-[100%] max-md:flex-col">
          <div className="flex-col mx-2 w-[70%] max-md:w-full flex-wrap">
            <div className="w-full">
              <div className="bg-surface-100 p-4 rounded-xl mb-2">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold font-exo mx-2 text-blue-500">
                    Courses
                  </h1>
                  <div className="group px-3">
                    <Link
                      href="/courses"
                      className="text-[#03A1D8] underline flex items-center group-hover:cursor-pointer"
                    >
                      Show All
                      <span>
                        <MdArrowRightAlt
                          className="ml-2 group-hover:cursor-pointer"
                          size={25}
                        />
                      </span>
                    </Link>
                  </div>
                </div>
                {loader ? (
                  <div className="flex justify-center items-center h-80">
                    <CircularProgress />
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap max-md:flex-nowrap max-md:flex-col max-md:items-center">
                    {courses?.slice(0, courseLimit).map((session) => (
                      <CourseCard
                        id={session.id}
                        key={session.id}
                        image={image1}
                        courseName={session.name}
                        route="course"
                        route1="courses"
                        courseDesc={session.short_description}
                        extraCount={50}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className=" w-full mt-4 h-[410px] flex gap-4 lg:flex-row flex-col-reverse max-md:w-full">
                <div className="bg-surface-100 p-2 rounded-xl grow">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="text-xl font-bold px-3 py-4 font-exo text-blue-500">
                        Weeks Activity
                      </h1>
                    </div>
                    <div className="group px-3 flex items-center justify-center">
                      <Link
                        href="/calendar"
                        className="text-[#03A1D8] underline flex items-center group-hover:cursor-pointer"
                      >
                        Show full calendar
                        <span>
                          <MdArrowRightAlt
                            className="ml-2 group-hover:cursor-pointer"
                            size={25}
                          />
                        </span>
                      </Link>
                    </div>
                  </div>
                  {loader ? (
                    <div className="flex justify-center items-center h-80">
                      <CircularProgress />
                    </div>
                  ) : (
                    <div className="px-4">
                      <FullCalendar
                        height={320}
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        events={calendarEvents}
                        eventContent={(arg) => (
                          <div
                            style={{ whiteSpace: "normal" }}
                            className="bg-blue-600 w-full rounded-md p-2 focus:outline-none cursor-pointer"
                          >
                            <b>{arg.timeText}m</b>
                            <p
                              className="text-blue-300"
                              title={arg.event.title}
                            >
                              {arg.event.title}
                            </p>
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex mx-2 h-[840px] w-[30%] max-md:h-[420px] max-md:overflow-y-scroll max-md:scrollbar-webkit max-md:w-full flex-col overflow-y-auto bg-surface-100 p-2 rounded-xl lg:w-fit scrollbar-webkit max-md:m-4">
            <div>
              <h1 className="text-xl font-bold px-3 py-4 font-exo text-blue-500">
                Your Current sessions
              </h1>
            </div>
            <div className="p-2 pt-0 flex lg:flex-col gap-2 lg:flex-nowrap flex-wrap max-md:flex-nowrap max-md:flex-col resize-none">
              {loader ? (
                <div className="flex justify-center items-center h-32 w-96">
                  <CircularProgress />
                </div>
              ) : sessions?.data?.length > 0 ? (
                sessions.data.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    id={assignment.course_id}
                    type={`Course Name: ${assignment.course}`}
                    priority={assignment.schedules}
                    capacity={assignment.no_of_students}
                    location={assignment.location}
                  />
                ))
              ) : (
                <p className="flex h-96 w-[400px] justify-center items-center">
                  No Upcoming Activities
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
