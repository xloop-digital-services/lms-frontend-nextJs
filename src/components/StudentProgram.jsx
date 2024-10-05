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

export default function StudentProgram({ path, progress, heading, role }) {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const regId = userData?.user_data?.registration_id;
  const [program, setProgram] = useState([]);
  const progId = userData?.User?.program?.id;
  const [loader, setLoader] = useState(true);

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
          console.log(response?.data);
        } else {
          console.error("Failed to fetch user, status:", response.status);
        }
      } catch (error) {
        console.log("error", error);
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
            <div className="bg-surface-100 p-8 rounded-xl ">
              <h2 className="text-xl text-[#022567] font-bold pb-1">{heading}</h2>
              <p className="pb-6">Select a course to view the {heading}</p>
              <div className="flex flex-col w-full gap-4">
                {/* {program?.map(([program]) => { */}
                {/* // return ( */}
                <MainCourseCard
                  //   key={program.id}
                  courseImg={courseImg}
                  courseName={program.name}
                  courseDesc={program.short_description}
                  // progress={courseProgress?.progress_percentage}
                  //   durationOfCourse={program.credit_hours}
                  route={`${path}/program/${program.id}`}
                />
                {/* ); */}
                {/* })} */}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
