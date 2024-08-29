"use client";
import {
  getCourseById,
  getModuleByCourseId,
  getProgressForCourse,
  updateCourse,
  updateModule,
} from "@/api/route";
import CourseHead from "@/components/CourseHead";
import { useSidebar } from "@/providers/useSidebar";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaCross,
  FaEdit,
  FaFile,
  FaFileDownload,
  FaFilePdf,
  FaTicketAlt,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import JsFileDownloader from "js-file-downloader";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";
import { Upload, UploadFile } from "@mui/icons-material";
import UploadContent from "@/components/Modal/UploadFile";

export const downloadFile = async (filePath) => {
  console.log('ye raha',filePath)
  const link = document.createElement("a");
  link.href = filePath;
  link.download = filePath.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const { userData } = useAuth();
  const courseId = params.courseId;
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const [courseData, setCourseData] = useState([]);
  const [modules, setModules] = useState([]);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [loader, setLoader] = useState(true);
  const [courseProgress, setCourseProgress] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingModule, setIsEditingModule] = useState(false);
  const [moduleId, setModuleId] = useState(null);
  const [uploadFile, setUploadFile] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(null);
  const [file, setFile] = useState(null);
  const [isCreatingModule, setCreatingModule] = useState(false);
  // console.log(isAdmin)

  async function fetchCoursesById() {
    const response = await getCourseById(courseId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setCourseData(response?.data?.data);
        setLoader(false);
      } else {
        console.error("Failed to fetch course, status:", response.status);
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
      } else {
        console.error(
          "Failed to fetch course progress, status:",
          response.status
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchModules() {
    const response = await getModuleByCourseId(courseId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setModules(response?.data?.data);
        setLoader(false);
      } else {
        console.error("Failed to fetch modules, status:", response.status);
        setLoader(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoader(false);
    }
  }
  const handleModuleID = (id) => {
    setModuleId(id);
  };
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUploaded(selectedFile.name); 
    }
  };

  async function handleSave() {
    try {
      const response = await updateCourse(courseData, courseId);
      if (response.status === 200) {
        toast.success("Course updated successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsEditing(false);
        fetchCoursesById();
      } else {
        toast.error("Failed to update course, status:", response.status, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // console.error("Failed to update course, status:", response.status);
      }
    } catch (error) {
      toast.error("Error updating course:", error, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // console.log("Error updating course:", error);
    }
  }

  // const handleFileUpload = () => {
  //   // console.log(field, "id", id);
  //   // setModuleId(id);
  //   setUploadFile(!uploadFile);
  // };

  // const handleUploadContent = async () => {
  //   if (file) {
  //     const data = {
  //       submitted_file: file,
  //       module_id: moduleId,
  //     };
  //     const formData = new FormData();
  //     formData.append("submitted_file", file);
  //     formData.append("module_id", moduleId);
  //     // formData.append(courseId)
  //     // formData.append("comments", comment);
  //     // formData.append("assignment", assignmentID);
  //     try {
  //       const response = await uploadAssignment(data);
  //       console.log("file uploaded", response);
  //       if (response.status === 201) {
  //         toast.success("Assignment has been submitted");
  //         setComment("");
  //         setUploadFile(false);
  //       }
  //     } catch (error) {
  //       toast.error(error);
  //       console.log("Error occurred:", error);
  //     }
  //   }
  // };

  async function handleSaveModule() {
    // event.preventDefault();
    try {
      const currentModule = modules.find((m) => m.id === moduleId);
      let moduleData = {
        name: "",
        description: "",
        course: "",
        files: [],
      };

      if (currentModule) {
        moduleData.name = currentModule.name;
        moduleData.description = currentModule.description;
        if (currentModule.files && currentModule.files.length > 0) {
          moduleData.files = currentModule.files.map((fileItem) => ({
            id: fileItem.id,
            file: fileItem.file,
            module_id: fileItem.module_id,
          }));
        }

        if (file) {
          moduleData.files.push({
            file: file,
            module_id: moduleId,
          });
        }
      }
      const formData = new FormData();
      formData.append("name", moduleData.name);
      formData.append("description", moduleData.description);
      formData.append("course", courseId);

      moduleData.files.forEach((fileItem, index) => {
        if (fileItem.id) {
          formData.append(`files[${index}][id]`, fileItem.id);
        }
        formData.append(`files[${index}][file]`, fileItem.file);
        formData.append(`files[${index}][module_id]`, fileItem.module_id);
      });

      const response = await updateModule(formData, moduleId);

      if (response.status === 200) {
        toast.success("Module updated successfully!", );
        setIsEditingModule(false);
        fetchModules();
      } else {
        toast.error(`Failed to update module, status: ${response.status}`);
      }
    } catch (error) {
      toast.error(`Error updating module: ${error.message}`);
      console.log("Error updating module:", error);
    }
  }
  useEffect(() => {
    fetchCoursesById();
    fetchModules();
    {
      isStudent && fetchCourseProgress();
    }
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
          <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
            <CourseHead
              id={courseId}
              name={courseData.name}
              rating="Top Instructor"
              instructorName="Maaz"
              progress={courseProgress?.progress_percentage}
              setIsEditing={setIsEditing}
              shortDesc={courseData.short_description}
              isEditing={isEditing}
              title="Edit course"
            />

            {isEditing ? (
              <div className="flex flex-col">
                <label className="text-lg font-bold">Course Name</label>
                <input
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={courseData.name}
                  onChange={(e) =>
                    setCourseData({ ...courseData, name: e.target.value })
                  }
                />
                <label className="text-lg font-bold">Short Description</label>
                <input
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={courseData.short_description}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      short_description: e.target.value,
                    })
                  }
                />
                <label className="text-lg font-bold mt-4">
                  About the Course
                </label>
                <textarea
                  rows="3"
                  className="px-2 block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                  value={courseData.about}
                  onChange={(e) =>
                    setCourseData({ ...courseData, about: e.target.value })
                  }
                />

                <button
                  className=" flex justify-center my-2 items-center w-32 gap-2  text-surface-100 bg-blue-300 px-2 py-3 rounded-xl mr-4 hover:bg-[#4296b3]"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex justify-between max-md:flex-col">
                  <h2 className="text-xl font-bold">About the Course</h2>
                </div>
                <p className="mt-2 mb-2 text-dark-500 text-justify">
                  {courseData.about}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center max-md:flex-col mt-8 mb-4">
                <h2 className="text-xl font-bold">Modules</h2>
                {isAdmin && (
                  <button
                    className=" flex justify-center items-center gap-2  text-surface-100 bg-blue-300 p-4 rounded-xl hover:bg-[#4296b3]"
                    onClick={() => setCreatingModule(!isCreatingModule)}
                  >
                    {isCreatingModule ? (
                      <p className="flex justify-center items-center gap-2">
                        <FaTimes />
                        Cancel Edit
                      </p>
                    ) : (
                      <p className="flex justify-center items-center gap-2">
                        <FaEdit /> Create Module
                      </p>
                    )}
                  </button>
                )}
              </div>

              {modules?.map((module, index) => (
                <div
                  key={module.id}
                  className="border border-dark-300 rounded-xl px-4"
                >
                  <div className="flex justify-between ">
                    <p className="text-dark-300 my-4"> Module {index + 1}</p>
                    {isAdmin && (
                      <div className="flex">
                        <button
                          className=" flex justify-center mt-4 items-center gap-2  text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-[#4296b3]"
                          onClick={() => {
                            if (moduleId === module.id) {
                              setIsEditingModule(false);
                              handleModuleID(null);
                            } else {
                              setIsEditingModule(true);
                              handleModuleID(module.id);
                            }
                          }}
                        >
                          {moduleId === module.id ? (
                            <p className="flex justify-center items-center gap-2">
                              <FaTimes />
                              {/* Cancel Edit */}
                            </p>
                          ) : (
                            <p className="flex justify-center items-center gap-2">
                              <FaEdit />
                              {/* Edit Module */}
                            </p>
                          )}
                        </button>
                        {moduleId === module.id ? (
                          <>
                            <button
                              className=" flex justify-center items-center gap-2 mt-4 text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-[#4296b3]"
                              onClick={handleSaveModule}
                            >
                              <FaCheck />
                            </button>
                            <input
                              type="file"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <button
                              className="flex justify-center items-center gap-2 mt-4 text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-[#4296b3]"
                              onClick={() =>
                                document
                                  .querySelector('input[type="file"]')
                                  .click()
                              }
                            >
                              <FaUpload />
                              Upload File
                            </button>
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                  {moduleId === module.id ? (
                    <input
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                      value={module.name}
                      onChange={(e) =>
                        setModules((prev) =>
                          prev.map((m) =>
                            m.id === module.id
                              ? { ...m, name: e.target.value }
                              : m
                          )
                        )
                      }
                    />
                  ) : (
                    <p className="font-bold my-2">{module.name}</p>
                  )}

                  <p className="text-dark-400 my-2">
                    {moduleId === module.id ? (
                      <textarea
                        rows="3"
                        className="px-2 block w-full text-dark-900 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                        value={module.description}
                        onChange={(e) =>
                          setModules((prev) =>
                            prev.map((m) =>
                              m.id === module.id
                                ? { ...m, description: e.target.value }
                                : m
                            )
                          )
                        }
                      />
                    ) : (
                      module.description
                    )}
                  </p>
                  {moduleId === module.id && fileUploaded && (
                    <p className="flex items-center text-blue-300 my-4 hover:cursor-pointer">
                      Uploaded File: {fileUploaded}
                    </p>
                  )}
                  {module?.files?.map((file) => (
                    <div
                      className="flex items-center gap-2 group"
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
                          className="flex items-center text-blue-300 my-4 group-hover:cursor-pointer"
                        >
                          {file.file.split("/").pop()}
                        </button>
                      </a>
                      <p>{downloadStatus}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {uploadFile && (
        <UploadContent
          field="course"
          setUploadFile={setUploadFile}
          // moduleId={moduleId}
          file={file}
          setFile={setFile}
          fileUploaded={fileUploaded}
          setFileUploaded={setFileUploaded}
          handleUploadContent={handleSaveModule}
        />
      )}
    </>
  );
}
