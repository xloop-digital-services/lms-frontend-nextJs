"use client";
import AssignmentCard from "@/components/AssignmentCard";
import CourseCard from "@/components/CourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React, { useEffect, useState } from "react";
import image1 from "/public/assets/img/course-image.png";
import { MdArrowRightAlt } from "react-icons/md";
import Link from "next/link";
import { useAuth } from "@/providers/AuthContext";
import { getCalendarData, getPendingAssignments } from "@/api/route";
import { CircularProgress } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { formatDateTime } from "./AdminDataStructure";

export default function StudentDashboard() {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loader, setLoader] = useState(true);
  const isStudent = userData?.Group === "student";
  const progId = userData?.User?.program?.id;
  const regId = userData?.user_data?.registration_id;
  const [calendarEvents, setCalendarEvents] = useState([]);
  const userId = userData?.User?.id;
  const group = userData?.Group;

  useEffect(() => {
    if (userData?.session) {
      // Extract courses from userData.session
      const sessionCourses = userData.session.map((session) => session.course);
      setCourses(sessionCourses);
      setLoader(false);
    } else {
      setLoader(true); // Show loader if no data is available
    }
  }, [userData]);

  async function fetchPendingAssignments() {
    const response = await getPendingAssignments(progId, regId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setAssignments(response.data);
        setLoader(false);
      } else {
        console.error(
          "Failed to fetch pending assignments, status:",
          response.status
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  async function fetchCalendarSessions() {
    const response = await getCalendarData(userId);
    try {
      if (response.status === 200) {
        console.log(response.data?.data);
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
      } else {
        console.error("Failed to fetch calendar data", response.status);
      }
    } catch (error) {
      console.error("Error fetching calendar data", error);
    }
  }

  console.log(calendarEvents);
  useEffect(() => {
    fetchPendingAssignments();

    if (!userId) return;
    fetchCalendarSessions();
  }, [progId, regId, userId, group]);

  const courseLimit = isSidebarOpen ? 2 : 3;

  if (loader) {
    return (
      <div className="flex h-screen justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
          isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 pl-10 "
        }`}
        style={{
          width: isSidebarOpen ? "81%" : "100%",
        }}
      >
        <div className="flex w-[100%] max-md:flex-col">
          <div className="flex-col mx-2 w-[70%] max-md:w-full flex-wrap">
            <div className="w-full">
              <div className="bg-[#ffffff] p-4 rounded-xl mb-2">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold font-exo mx-2">Courses</h1>
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

                <div className="flex gap-2 flex-wrap max-md:flex-nowrap max-md:flex-col">
                  {isStudent &&
                    courses
                      .slice(0, courseLimit)
                      .map((course) => (
                        <CourseCard
                          id={course.id}
                          key={course.id}
                          image={image1}
                          courseName={course.name}
                          route="course"
                          route1="courses"
                          courseDesc={course.short_description}
                          extraCount={50}
                        />
                      ))}
                </div>
              </div>
            </div>
            <div>
              <div className="w-full mt-4 h-[410px] flex gap-4 lg:flex-row flex-col-reverse max-md:w-full">
                <div className="bg-[#ffffff] p-2 rounded-xl grow">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="text-xl font-bold px-3 py-4 font-exo">
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
                          <b> {arg.timeText}m </b>
                          <p className="text-blue-300" title={arg.event.title}>
                            {arg.event.title}
                          </p>{" "}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex mx-2 h-[840px] w-[30%] max-md:w-full flex-col overflow-y-auto bg-[#ffffff] p-2 rounded-xl lg:w-fit scrollbar-webkit max-md:m-4">
            <div>
              <h1 className="text-xl font-bold px-3 py-4 font-exo">
                Recent Activities
              </h1>
            </div>

            <div className="p-2 pt-0 flex lg:flex-col gap-2 lg:flex-nowrap flex-wrap max-md:flex-nowrap max-md:flex-col resize-none">
              {assignments?.data?.items &&
              assignments?.data?.items.length > 0 ? (
                assignments.data.items.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    id={assignment.course_id}
                    category={assignment.course_name}
                    title={assignment.question || assignment.title}
                    content={assignment.description}
                    priority={formatDateTime(assignment?.due_date)}
                    type={assignment.type}
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
