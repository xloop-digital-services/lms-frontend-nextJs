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

  // //console.log(group);

  // if (!insId) return;
  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoader(true);
    try {
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        const coursesData = sessions.map((session) => session.course);
        setCourses(coursesData);

        setLoader(false);
      } else {
        //console.error("Failed to fetch user, status:", response.status);
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
        // //console.log(assignments);
      } else {
        //console.error(
        //   "Failed to fetch pending assignments, status:",
        //   response.status
        // );
      }
    } catch (error) {
      //console.log("error", error);
    }
  }
  async function fetchCalendarSessions() {
    const response = await getCalendarData(userId);
    try {
      if (response.status === 200) {
        //console.log(response.data?.data);
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
        //console.error("Failed to fetch calendar data", response.status);
      }
    } catch (error) {
      //console.error("Error fetching calendar data", error);
    }
  }

  const courseLimit = isSidebarOpen ? 2 : 3;

  useEffect(() => {
    // fetchCourses();
    fetchPendingAssignments();
    if (!userId) return;
    fetchCalendarSessions();
  }, [userId, group]);

  //console.log(courses);
  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
          isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 pl-10 "
        }`}
        style={{
          // paddingBottom: "20px",
          width: isSidebarOpen ? "81%" : "100%",
        }}
      >
        {/* <h2 className="ml-2 font-exo text-3xl font-bold">Instructor Dashboard</h2> */}
        <div className="flex w-[100%] max-md:flex-col">
          <div className="flex-col mx-2 w-[70%] max-md:w-full flex-wrap">
            <div className="w-full">
              {" "}
              <div className="bg-surface-100 p-4 rounded-xl mb-2">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold font-exo mx-2 text-blue-500"> Courses</h1>
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
                  {courses?.slice(0, courseLimit).map((session) => {
                    return (
                      <CourseCard
                        id={session.id}
                        key={session.id}
                        image={image1}
                        courseName={session.name} // Accessing course name inside 'course' object
                        route="course"
                        route1="courses"
                        courseDesc={session.short_description} // Accessing short description
                        // progress="50%"
                        // avatars={avatars}
                        extraCount={50}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <div className=" w-full mt-4 h-[410px] flex gap-4 lg:flex-row flex-col-reverse  max-md:w-full">
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

          <div className="flex mx-2  h-[840px] w-[30%] max-md:w-full flex-col overflow-y-auto bg-surface-100 p-2 rounded-xl lg:w-fit scrollbar-webkit max-md:m-4">
            <div>
              <h1 className="text-xl font-bold px-3 py-4 font-exo text-blue-500">
                Your Current sessions
              </h1>
            </div>

            <div className="p-2 pt-0 flex lg:flex-col gap-2 lg:flex-nowrap flex-wrap max-md:flex-nowrap max-md:flex-col resize-none ">
              {sessions?.data && sessions?.data?.length > 0 ? (
                sessions.data.map((assignment) => {
                  return (
                    <AssignmentCard
                      key={assignment.id}
                      id={assignment.course_id}
                      type={`Course Name: ${assignment.course}`}
                      // title={assignment.question || assignment.title}
                      // content={assignment.description}
                      priority={`Start Time: ${assignment?.start_time}\n End Time:${assignment?.end_time}`}
                      category={`Capacity: ${assignment.no_of_student}\t\t\tLocation:${assignment.location}`}
                      // avatars={avatars}
                      // extraCount={50}
                    />
                  );
                })
              ) : (
                <p className="flex h-96 w-[400px] justify-center items-center">
                  No Upcoming Activities
                </p>
              )}

              {/* Add more AssignmentCard components as needed */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}