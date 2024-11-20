"use client";
import MainCourseCard from "@/components/MainCourseCard";
import { useSidebar } from "@/providers/useSidebar";
import React, { useContext, useEffect, useState } from "react";
import courseImg from "/public/assets/img/course-image.png";
import {
  getCourseByProgId,
  getCourses,
  getProgramById,
  getProgramByRegId,
  getProgressForCourse,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function StudentProgram({ path, progress, heading, role }) {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const regId = userData?.user_data?.registration_id;
  const [program, setProgram] = useState([]);
  const progId = userData?.User?.program?.id;
  const [loader, setLoader] = useState(true);
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!regId) return;
    async function fetchStudentProgram() {
      const response = await getProgramById(progId);
      setLoader(true);
      try {
        if (response.status === 200) {
          setProgram(response.data?.data);
          setLoader(false);
          // setCourseId(response?.data?.id)
          //console.log(response?.data);
        } else {
          //console.error("Failed to fetch user, status:", response.status);
        }
      } catch (error) {
        //console.log("error", error);
      }
    }
    fetchStudentProgram();
  }, [regId]);

  if (loader) {
    <CircularProgress />;
  }

  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
          isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 pl-10 pr-10"
        }`}
        style={{
          // paddingBottom: "20px",
          width: isSidebarOpen ? "81%" : "100%",
        }}
      >
        {loader ? (
          <div className="flex h-screen justify-center items-center ">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className="bg-surface-100 p-8 rounded-xl max-md:p-4">
              <>
                <div className="flex items-center">
                  <div
                    className="text-dark-400 flex gap-2 items-center cursor-pointer hover:text-blue-300 mr-4"
                    onClick={goBack}
                  >
                    <FaArrowLeft size={20} />
                    {/* <p>Back</p> */}
                  </div>
                  <h2 className="font-exo text-xl max-md:text-center max-md:justify-center text-blue-500 font-bold flex justify-start items-center">
                    {heading}
                  </h2>
                </div>
                <p className="pb-6">Select a program to view</p>
              </>
              <div className="flex flex-col max-md:flex-wrap w-full max-md:w-full max-sm:items-center max-sm:justify-center">
                <MainCourseCard
                  courseImg={courseImg}
                  courseName={program.name}
                  courseDesc={program.short_description}
                  route={`${path}/program/${program.id}`}
                  picture={program.picture}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
