"use client";
import AssignmentCard from "@/components/AssignmentCard";
import CourseCard from "@/components/CourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React, { useEffect, useState } from "react";
import image1 from "/public/assets/img/course-image.png";
import { MdArrowRightAlt } from "react-icons/md";
import Link from "next/link";
import { useAuth } from "@/providers/AuthContext";
import { getCourseByProgId, getPendingAssignments } from "@/api/route";
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
  const userId = userData?.user?.id;
  const regId = userData?.user_data?.registration_id;
  // console.log(userId);
  console.log(progId);

  useEffect(() => {
    if (!progId) return;
    async function fetchCourses() {
      const response = await getCourseByProgId(progId);
      setLoader(true);
      try {
        if (response.status === 200) {
          setCourses(response.data);
          setLoader(false);
          console.log(courses);
        } else {
          console.error("Failed to fetch courses", response.status);
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    fetchCourses();
  }, [progId]);

  async function fetchPendingAssignments() {
    const response = await getPendingAssignments(progId, regId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setAssignments(response.data);
        setLoader(false);
        console.log(assignments);
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

  const courseLimit = isSidebarOpen ? 2 : 3;

  useEffect(() => {
    // fetchCourses();
    fetchPendingAssignments();
  }, []);
  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
          isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 "
        }`}
        style={{
          // paddingBottom: "20px",
          width: isSidebarOpen ? "85%" : "100%",
        }}
      >
        <h2 className=" font-exo text-3xl font-bold">Student Dashboard</h2>
        <div className="flex w-[100%] max-md:flex-col">
          <div className="flex-col mx-2 w-[70%] max-md:w-full flex-wrap">
            <div className="w-full">
              {" "}
              <div className="bg-[#ffffff] p-4 rounded-xl mb-2">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold font-exo mx-2 "> Courses</h1>
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
                    courses?.data?.slice(0, courseLimit).map((course) => {
                      return (
                        <CourseCard
                          id={course.id}
                          key={course.id}
                          image={image1}
                          courseName={course.name}
                          route="course"
                          route1="courses"
                          courseDesc={course.short_description}
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
                <div className="bg-[#ffffff] p-2  rounded-xl grow">
                  <div>
                    <h1 className="text-xl font-bold px-3 py-4 font-exo">
                      Weeks Activity
                    </h1>
                  </div>
                  <div className="px-4">
                    <FullCalendar
                      // className="overflow-y-clip"
                      height={320}
                      plugins={[dayGridPlugin]}
                      initialView="dayGridMonth"
                      events={[
                        {
                          title: "Assignment Submission",
                          date: "2024-08-22",
                        },
                        {
                          title: "Mobile Application Development",
                          date: "2024-08-10",
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex mx-2  h-[840px] w-[30%] max-md:w-full flex-col overflow-y-auto bg-[#ffffff] p-2 rounded-xl lg:w-fit scrollbar-webkit max-md:m-4">
            <div>
              <h1 className="text-xl font-bold px-3 py-4 font-exo">
                Recent Activities
              </h1>
            </div>

            <div className="p-2 pt-0 flex lg:flex-col gap-2 lg:flex-nowrap flex-wrap max-md:flex-nowrap max-md:flex-col resize-none ">
              {assignments?.data?.items &&
              assignments?.data?.items.length > 0 ? (
                assignments.data.items.map((assignment) => {
                  return (
                    <AssignmentCard
                      key={assignment.id}
                      id={assignment.course_id}
                      category={assignment.course_name}
                      title={assignment.question || assignment.title}
                      content={assignment.description}
                      priority={formatDateTime(assignment?.due_date)}
                      type={assignment.type}
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
