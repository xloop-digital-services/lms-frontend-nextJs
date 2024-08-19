"use client";
import AssignmentCard from "@/components/AssignmentCard";
import CourseCard from "@/components/CourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React, { useEffect, useState } from "react";
import image1 from "/public/assets/img/course-image.png";
import avatars from "/public/assets/img/images.png";
import { MdArrowRightAlt } from "react-icons/md";
import Calender from "@/components/Calender";
import Link from "next/link";
import { useGroup } from "@/providers/useGroup";
import { useAuth } from "@/providers/AuthContext";
import { getCourseByProgId, getPendingAssignments } from "@/api/route";
import { formatDateTime } from "@/components/StudentDataStructure";
import { CircularProgress } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loader, setLoader] = useState(true);

  const isStudent = userData?.Group === "student";
  const progId = userData?.session?.program;
  const userId = userData?.user?.id;
  // console.log(userId);
  console.log(progId);

  useEffect(() => {
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
    const response = await getPendingAssignments(progId, userId);
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
  useEffect(() => {
    fetchPendingAssignments();
  }, []);

  return (
    <>
      {loader ? (
        <div className="flex h-screen justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div
          className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
            isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
          }`}
          style={{
            // paddingBottom: "20px",
            width: isSidebarOpen ? "84%" : "100%",
          }}
        >
          <div className="bg-[#ffffff] p-5 rounded-xl ">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold font-exo"> Courses</h1>
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
            <div className="flex space-x-4 flex-wrap ">
              {isStudent &&
                courses?.data?.map((course) => {
                  return (
                    <CourseCard
                      id={course.id}
                      key={course.id}
                      image={image1}
                      courseName={course.name}
                      courseDesc={course.short_description}
                      // progress="50%"
                      // avatars={avatars}
                      extraCount={50}
                    />
                  );
                })}
            </div>
          </div>
          <div className="flex gap-4 lg:flex-row flex-col-reverse ">
            <div className="bg-[#ffffff] p-2  rounded-xl grow">
              <div>
                <h1 className="text-xl font-bold px-3 py-4 font-exo">
                  Weeks Activity
                </h1>
              </div>
              <div className="h-80 overflow-y-scroll scrollbar-webkit p-4">
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={[
                    { title: "Assignment Submission", date: "2024-08-22" },
                    {
                      title: "Mobile Application Development",
                      date: "2024-08-10",
                    },
                  ]}
                />
              </div>
            </div>
            <div className="bg-[#ffffff] p-2 rounded-xl overflow-hidden h-[360px] lg:w-fit ">
              <div>
                <h1 className="text-xl font-bold px-3 py-4 font-exo">
                  Assignment Progress
                </h1>
              </div>

              <div className="p-2 pt-0 flex lg:flex-col gap-2 lg:flex-nowrap flex-wrap resize-none overflow-y-auto h-[300px] scrollbar-webkit ">
                {assignments?.data?.map((assignment) => {
                  return (
                    <AssignmentCard
                      key={assignment.id}
                      id={assignment.id}
                      category={assignment.course_name}
                      title={assignment?.question}
                      content={assignment?.description}
                      priority={formatDateTime(assignment?.due_date)}
                      // avatars={avatars}
                      // extraCount={50}
                    />
                  );
                })}
                {/* Add more AssignmentCard components as needed */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
