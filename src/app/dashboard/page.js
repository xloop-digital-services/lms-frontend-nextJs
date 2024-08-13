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
import { getAllCourses } from "@/api/route";

export default function Page() {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const [courses, setCourses] = useState([]);

  const isStudent = userData?.Group === "student";

  async function fetchCourses() {
    const response = await getAllCourses();
    try {
      if (response.status === 200) {
        setCourses(response.data);
        console.log(courses);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-20 font-inter ${
          isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
        }`}
        style={{
          // paddingBottom: "20px",
          width: isSidebarOpen ? "84%" : "100%",
        }}
      >
        <div className="bg-[#ffffff] p-5  mx-5 rounded-xl space-y-4  ">
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
          <div className="flex space-x-4 mx-auto flex-wrap">
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
        <div className="flex gap-4 mx-5 lg:flex-row flex-col-reverse ">
          <div className="bg-[#ffffff] p-2  rounded-xl grow">
            <div>
              <h1 className="text-xl font-bold px-3 py-4 font-exo">
                Weeks Activity
              </h1>
            </div>
            <div>
              <Calender />
            </div>
          </div>
          <div className="bg-[#ffffff] p-2 rounded-xl overflow-hidden h-[360px] lg:w-fit ">
            <div>
              <h1 className="text-xl font-bold px-3 py-4 font-exo">
                Assignment Progress
              </h1>
            </div>
            <div className="p-2 pt-0 flex lg:flex-col gap-2 lg:flex-nowrap flex-wrap resize-none overflow-y-auto h-[300px] scrollbar-webkit ">
              <AssignmentCard
                category="Backend"
                title="Beginner's Guide to Becoming a Professional Backend Developer"
                content="Increase engagement, and ultimately drive higher customer interest and satisfaction."
                priority="HIGH"
                avatars={avatars}
                extraCount={50}
              />
              <AssignmentCard
                category="UI/UX Design"
                title="Beginner's Guide to Becoming a Professional Backend Developer"
                content="Increase engagement, and ultimately drive higher customer interest and satisfaction."
                priority="MED"
                avatars={avatars}
                extraCount={20}
              />
              <AssignmentCard
                category="Backend"
                title="Beginner's Guide to Becoming a Professional Backend Developer"
                content="Increase engagement, and ultimately drive higher customer interest and satisfaction."
                priority="HIGH"
                avatars={avatars}
                extraCount={50}
              />
              {/* Add more AssignmentCard components as needed */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
