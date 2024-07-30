"use client";
import AssignmentCard from "@/components/AssignmentCard";
import CourseCard from "@/components/CourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React from "react";
import image1 from "/public/assets/img/course-image.png";
import avatars from "/public/assets/img/images.png";
export default function page() {
  const { isSidebarOpen } = useSidebar();

  // const avatars = [
  //   "https://randomuser.me/api/portraits/men/32.jpg",
  //   "https://randomuser.me/api/portraits/women/31.jpg",
  //   "https://randomuser.me/api/portraits/men/33.jpg",
  //   "https://randomuser.me/api/portraits/women/32.jpg",
  // ];
  return (
    <>
      <div
        className={`flex-1 transition-transform pt-28 max-md:pt-44 ${
          isSidebarOpen
            ? "translate-x-64 px-5 pl-16"
            : "translate-x-0 pl-10 pr-4"
        }`}
        style={{
          paddingBottom: "20px",
          width: isSidebarOpen ? "84%" : "100%",
        }}
      >
          <AssignmentCard
            category="Backend"
            title="Beginner's Guide to Becoming a Professional Backend Developer"
            content="Increase engagement, and ultimately drive higher customer interest and satisfaction."
            priority="HIGH"
            avatars={avatars}
            extraCount={50}
          />{" "}
          <CourseCard
            image={image1}
            category="Backend"
            title="Beginner's Guide to Becoming a Professional Backend Developer"
            progress="50%"
            avatars={avatars}
            extraCount={50}
          />
      </div>
    </>
  );
}
