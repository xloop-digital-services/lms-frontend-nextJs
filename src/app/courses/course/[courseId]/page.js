"use client";
import {
  getCourseById,
  getModuleByCourseId,
  getProgressForCourse,
  getProgressForQuiz,
} from "@/api/route";
import CourseHead from "@/components/CourseHead";
import { useSidebar } from "@/providers/useSidebar";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFile, FaFileDownload, FaFilePdf } from "react-icons/fa";
import JsFileDownloader from "js-file-downloader";

export const downloadFile = async (filePath) => {
  console.log('ye raha',filePath)
  const link = document.createElement("a");
  link.href = filePath;
  link.download = filePath.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // console.log("file", link);
};
export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const courseId = params.courseId;
  const [courseData, setCourseData] = useState([]);
  const [modules, setModules] = useState([]);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [loader, setLoader] = useState(true);
  const [courseProgress, setCourseProgress] = useState({});
  // console.log(courseId);

  async function fetchCoursesById() {
    const response = await getCourseById(courseId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setCourseData(response?.data?.data);
        setLoader(false);
        console.log(courseData);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchCourseProgress() {
    const response = await getProgressForCourse(courseId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setCourseProgress(response?.data?.data);
        setLoader(false);
        console.log(courseProgress);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  console.log(courseProgress?.progress_percentage);

  console.log(courseProgress);

  async function fetchModules() {
    const response = await getModuleByCourseId(courseId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setModules(response?.data?.data);
        setLoader(false);
        console.log(modules);
      } else {
        console.error("Failed to fetch user, status:", response.status);
        setLoader(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoader(false);
    }
  }

  useEffect(() => {
    fetchCoursesById();
    fetchModules();
    fetchCourseProgress();
  }, []);

  return (
    <>
      {loader ? (
        <div className="flex h-full justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div
          className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${
            isSidebarOpen
              ? "translate-x-64 pl-16 "
              : "translate-x-0 pl-10 pr-10"
          }`}
          style={{
            // paddingBottom: "20px",
            width: isSidebarOpen ? "86%" : "100%",
          }}
        >
          <div className=" bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
            <CourseHead
              id={courseId}
              rating="Top Instructor"
              instructorName="Maaz"
              progress={courseProgress?.progress_percentage}
            />

            <div className="flex flex-col">
              <div className="flex justify-between max-md:flex-col">
                <h2 className="text-xl font-bold">About the Course</h2>
              </div>

              <p className="mt-2 mb-2 text-dark-500 text-justify">
                {courseData.about}
              </p>
            </div>
            {/* <div className="flex flex-col">
          <div className="flex justify-between max-md:flex-col mt-8 mb-4">
            <h2 className="text-xl font-bold">Skills You gain</h2>
          </div>

          <div className="flex gap-2 max-md:flex-col">
            <div className="flex bg-dark-800 w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
              <p className=" uppercase text-[12px] ">User Experience (UX)</p>
            </div>
            <div className="flex bg-dark-800 w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
              <p className=" uppercase text-[12px] ">Prototype</p>
            </div>
            <div className="flex bg-dark-800 w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
              <p className=" uppercase text-[12px] ">Wireframe</p>
            </div>
            <div className="flex bg-dark-800 w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
              <p className=" uppercase text-[12px] ">UX Research</p>
            </div>
            <div className="flex bg-dark-800 w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
              <p className="uppercase text-[12px] ">
                User Experience Design(UXD)
              </p>
            </div>
          </div>
        </div> */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between max-md:flex-col mt-8 mb-4">
                <h2 className="text-xl font-bold">Modules</h2>
              </div>

              {modules?.map((module, index) => {
                return (
                  <>
                    <div
                      key={module.id}
                      className="border border-dark-300 rounded-xl px-4"
                    >
                      <p className="text-dark-300 my-4"> Module {index + 1}</p>

                      <p className="font-bold my-2">{module.name}</p>
                      <p className="text-dark-400 my-2">
                        {" "}
                        {module.description}
                      </p>
                      {module?.files?.map((file) => (
                        <div
                          className="flex items-center gap-2 group "
                          key={file.id}
                        >
                          <a
                            href={file.file}
                            className="group-hover:cursor-pointer flex justify-center items-center space-x-2"
                            download
                          >
                            <FaFileDownload
                              size={20}
                              fill="#03A1D8"
                              className="group-hover:cursor-pointer"
                            />
                            <button
                              onClick={() => downloadFile(file.file)}
                              download
                              className="flex items-center text-blue-300 my-4 group-hover:cursor-pointer"
                            >
                              {file.file.split("/").pop()}
                            </button>
                          </a>
                          <p>{downloadStatus}</p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
