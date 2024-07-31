"use client";
import AssignmentCard from "@/components/AssignmentCard";
import CourseCard from "@/components/CourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React from "react";
import image1 from "/public/assets/img/course-image.png";
import avatars from "/public/assets/img/images.png";
import { MdArrowRightAlt } from "react-icons/md";
import Calender from "@/components/Calender";

export default function page() {
  const { isSidebarOpen } = useSidebar();

  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-44 font-inter ${
          isSidebarOpen
            ? "translate-x-64 pl-16"
            : "translate-x-0 pl-10 pr-4"
        }`}
        style={{
          // paddingBottom: "20px",
          width: isSidebarOpen ? "86%" : "100%",
        }}
      >
        <div className="bg-[#ffffff]  p-2  mx-5 rounded-xl space-y-4  ">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold pl-3 pt-3 font-exo"> Courses</h1>
            <div className="group px-3">
              <p className="text-[#03A1D8] underline flex items-center group-hover:cursor-pointer">
                Show All
                <span>
                  <MdArrowRightAlt
                    className="ml-2 group-hover:cursor-pointer"
                    size={25}
                  />
                </span>
              </p>
            </div>
          </div>
          <div className="flex space-x-4 px-3 pb-3 ">
            <CourseCard
              image={image1}
              category="Backend"
              title="Beginner's Guide to Becoming a Professional Backend Developer"
              progress="50%"
              avatars={avatars}
              extraCount={50}
            />
            <CourseCard
              image={image1}
              category="Backend"
              title="Beginner's Guide to Becoming a Professional Backend Developer"
              progress="50%"
              avatars={avatars}
              extraCount={50}
            />
            <CourseCard
              image={image1}
              category="Backend"
              title="Beginner's Guide to Becoming a Professional Backend Developer"
              progress="50%"
              avatars={avatars}
              extraCount={50}
            />
            <CourseCard
              image={image1}
              category="Frontend"
              title="Advanced Techniques in Frontend Development"
              progress="75%"
              avatars={avatars}
              extraCount={20}
            />
            {
              !isSidebarOpen && 
              <CourseCard
              image={image1}
              category="Frontend Tech"
              title="Advanced Techniques in Frontend Development"
              progress="15%"
              avatars={avatars}
              extraCount={20}
            />
            }
          </div>
        </div>
        <div className="flex gap-4 mx-5">
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
          <div className="bg-[#ffffff] p-2 rounded-xl overflow-hidden h-[360px] w-fit">
            <div>
              <h1 className="text-xl font-bold px-3 py-4 font-exo">
                Assignment Progress
              </h1>
            </div>
            <div className="p-2 pt-0 flex flex-col resize-none overflow-y-auto h-[300px] scrollbar-webkit ">
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
