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
import { FaFile, FaFilePdf } from "react-icons/fa";
import JsFileDownloader from "js-file-downloader";

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
  // console.log(courseProgress?.data?.progress_percentage)

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
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    fetchCoursesById();
    fetchModules();
    fetchCourseProgress();
  }, []);

  const downloadFile = async (filePath) => {
    console.log("file", filePath);
    try {
      // const response = await axios.get(`home/lms/src${filePath}`);
      // console.log(response);
      new JsFileDownloader({
        url: filePath,
      })
        .then(() => {
          console.log("file downloaded");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error downloading file:", error);
      console.error("Error details:", error.response || error.message);
      setDownloadStatus("Error downloading");
    }
  };

  return (
    <>
      {loader ? (
        <div className="flex h-screen justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div
          className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-20 font-inter ${
            isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
          }`}
          style={{
            width: isSidebarOpen ? "84%" : "100%",
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
                        <div className="flex items-center gap-2" key={file.id}>
                          <FaFilePdf size={16} fill="#03A1D8" />
                          <button
                            onClick={() => downloadFile(file.file)}
                            download
                            className="flex items-center text-blue-300 my-4 cursor-pointer"
                          >
                            {file.file.split("/").pop()}
                          </button>
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