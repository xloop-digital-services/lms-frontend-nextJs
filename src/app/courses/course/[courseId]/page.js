"use client";
import React, { useEffect, useState } from "react";
import {
  createModule,
  createSkill,
  getAllSkillCourses,
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
import {
  FaCheck,
  FaEdit,
  FaFileDownload,
  FaPlus,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import JsFileDownloader from "js-file-downloader";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";
import { Upload, UploadFile } from "@mui/icons-material";
import UploadContent from "@/components/Modal/UploadFile";

export const downloadFile = async (filePath) => {
  console.log("ye raha", filePath);
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
  const session = userData?.session?.find((s) => s.courseId);
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
  const [file, setFile] = useState("");
  const [isCreatingModule, setCreatingModule] = useState(false);
  const [skills, setSkills] = useState("");
  const [module, setModule] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");
  const [inputCourses, setInputCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [skillbyID, setSkillbyID] = useState("");
  const [skillId, setSkillId] = useState("");
  const [fetch, setFetch] = useState(false);
  const [courseStatus, setCourseStatus] = useState(0);

  const [skill, setSkill] = useState();
  // console.log(isAdmin)
  const [skillName, setSkillName] = useState("");

  async function fetchCoursesById() {
    const response = await getCourseById(courseId);
    setLoader(true);
    try {
      if (response.status === 200) {
        const courseData = response?.data?.data;
        setCourseData(courseData);
        setCourseStatus(courseData?.status);

        const skillsArray = courseData?.skills ?? [];
        const skillResponse = await getAllSkillCourses();
        const allSkills = skillResponse?.data?.data ?? [];

        const matchedSkills = skillsArray.map((skillId) => {
          const foundSkill = allSkills.find((skill) => skill.id === skillId);
          return foundSkill ? foundSkill.skill_name : "Unknown skill";
        });

        setSkills(matchedSkills);
        setLoader(false);
      } else {
        console.error("Failed to fetch course, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    const skills = {
      skill_name: skillName,
    };
    try {
      const response = await createSkill(skills);
      if (response.status === 201) {
        toast.success("Skill created Successfully!");
        // setSkillName("");
        setSkill(false);
        fetchAllSkills();
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      toast.error(`Error creating skill: ${error?.message}`);
      // console.log(error?.data?.data?.skill_name?.[0])
    }
  };
  const handleSkills = () => {
    setSkill(!skill);
  };

  const handleSkillId = (id) => {
    setSkillId(id);
    fetchSkillbyId();
  };

  async function fetchSkillbyId() {
    const response = await getAllSkillCourses();
    setLoader(true);
    try {
      if (response.status === 200) {
        setSkillbyID(response?.data?.data);
        console.log(response?.data?.data);
        setLoader(false);
      } else {
        console.error("Failed to fetch skills, status:", response.status);
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
  async function fetchAllSkills() {
    try {
      const response = await getAllSkillCourses();
      if (response.status === 200) {
        setCourses(response.data?.data);
      } else {
        console.error("Failed to fetch courses, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }
  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selectedCourse = courses.find(
      (course) => course.skill_name === selectedName
    );

    if (selectedCourse) {
      if (!inputCourses.includes(selectedCourse.id)) {
        setInputCourses((prevCourses) => [...prevCourses, selectedCourse.id]);
      } else {
        toast.error("This skill is already selected.");
      }
    } else {
      console.error("Skill not found");
    }
  };

  const removeCourse = (courseToRemove) => {
    setInputCourses(inputCourses.filter((course) => course !== courseToRemove));
  };

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

  // console.log(file);

  const handleCreateModule = async (event) => {
    event.preventDefault();
    const moduleData = {
      name: moduleName,
      description: moduleDesc,
      course: courseId,
      files: file,
    };
    try {
      const formData = new FormData();
      formData.append("name", moduleData.name);
      formData.append("description", moduleData.description);
      formData.append("course", moduleData.course);
      formData.append("files", file);

      const response = await createModule(moduleData);
      if (response.status === 201) {
        toast.success("Module created successfully!");
        setModule(moduleData);
        setModuleName("");
        setModuleDesc("");
        fetchModules();
        setFileUploaded("");
        setCreatingModule(false);
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      toast.error(`Error creating course: ${error.message}`);
    }
  };

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
    const updatedCourseData = {
      ...courseData,
      status: courseStatus,
      skills: [...courseData.skills, ...inputCourses],
    };

    try {
      const response = await updateCourse(updatedCourseData, courseId);
      if (response.status === 200) {
        toast.success("Course updated successfully!");
        setIsEditing(false);
        fetchCoursesById();
      } else {
        toast.error("Failed to update course, status:", response.status);
      }
    } catch (error) {
      toast.error("Error updating course:", error);
    }
  }

  async function handleSaveModule() {
    try {
      const currentModule = modules.find((m) => m.id === moduleId);
      let moduleData = {
        name: "",
        description: "",
        course: courseId,
        files: [],
      };

      if (currentModule) {
        moduleData.name = currentModule.name;
        moduleData.description = currentModule.description;

        if (currentModule.files && currentModule.files.length > 0) {
          moduleData.files = currentModule.files.map((fileItem) => ({
            id: fileItem.id,
            file: fileItem.file instanceof File ? fileItem.file : null,
            module_id: fileItem.module_id,
          }));
        }

        if (file && file instanceof File) {
          moduleData.files.push({
            file: file,
            module_id: moduleId,
          });
        }
      }

      const formData = new FormData();
      formData.append("name", moduleData.name);
      formData.append("description", moduleData.description);
      formData.append("course", moduleData.course);
      formData.append("files", file);

      const response = await updateModule(formData, moduleId);
      if (response.status === 200) {
        toast.success("Module updated successfully!");
        setIsEditingModule(false);
        setModuleId(null);
        fetchModules();
        setFileUploaded("");
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
    fetchAllSkills();
    // fetchSkillbyId();
    {
      isStudent && fetchCourseProgress();
    }
    fetchAllSkills();
  }, []);
  // console.log(courseData?.status);
  // useEffect(() => {
  //   // if (courseData?.skills?.length > 0) {

  //   // console.log(courseData?.skills);
  // }, []);

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
              program="course"
              setFetch={setFetch}
              // name={courseData.name}
              // rating="Top Instructor"
              // instructorName={instructor}

              progress={courseProgress?.progress_percentage}
              setIsEditing={setIsEditing}
              // shortDesc={courseData.short_description}
              isEditing={isEditing}
              // title="Edit course"
              // chr={`${courseData.theory_credit_hours}+ ${courseData.lab_credit_hours}`}
            />

            {isEditing ? (
              <div className="flex flex-col">
                <div>
                  <div className="flex justify-between my-2">
                    <label className="text-lg font-exo font-bold">
                      Course Name
                    </label>

                    <div className="flex items-center">
                      <span className="mr-4 text-md">Course Status</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={courseStatus === 1}
                          onChange={() =>
                            setCourseStatus((prevStatus) =>
                              prevStatus === 0 ? 1 : 0
                            )
                          }
                          className="sr-only"
                        />

                        <div className="w-11 h-6 bg-blue-600 rounded-full"></div>
                        <div
                          className={`absolute w-4 h-4 bg-blue-300 rounded-full shadow-md transform transition-transform ${
                            courseStatus === 1
                              ? "translate-x-5"
                              : "translate-x-1"
                          }`}
                        ></div>
                      </label>
                      <span className="ml-4 text-md">
                        {courseStatus === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={courseData.name}
                  onChange={(e) =>
                    setCourseData({ ...courseData, name: e.target.value })
                  }
                />
                <label className="text-lg font-exo font-bold">
                  Short Description
                </label>
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
                <label className="font-exo text-lg font-bold mt-4">
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

                <div className="my-4 sm:mb-0">
                  <label className="text-lg font-exo font-bold">
                    Credit Hours
                  </label>
                  <div className="sm:pr-4">
                    <div className="relative w-full h-12 px-2 gap-4 flex items-center border-dark-400 rounded-md border mt-2 py-1.5">
                      Theory Hours and
                      <input
                        id="cr-hr-th"
                        name="cr-hr-th"
                        type="number"
                        min={0}
                        value={courseData.theory_credit_hours ?? 0}
                        onChange={(e) =>
                          setCourseData({
                            ...courseData,
                            theory_credit_hours:
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value),
                          })
                        }
                        placeholder="select"
                        className="px-2 block w-20 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                      />
                      Lab/Practical Hours
                      <input
                        id="cr-hr"
                        name="cr-hr"
                        type="number"
                        min={0}
                        placeholder="select"
                        value={courseData.lab_credit_hours ?? 0}
                        onChange={(e) =>
                          setCourseData({
                            ...courseData,
                            lab_credit_hours:
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value),
                          })
                        }
                        className="px-2 block w-20 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="my-4 sm:mb-0">
                    <label className="text-lg font-exo font-bold">
                      Skills Names
                    </label>
                    <div className="sm:pr-4">
                      <div className="relative flex flex-wrap items-center gap-2 bg-white outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 shadow-sm ring-1 ring-inset focus:ring-inset p-2 sm:text-sm sm:leading-6">
                        {inputCourses?.map((courseId) => {
                          const course = courses.find((c) => c.id === courseId);
                          return (
                            <div
                              key={courseId}
                              value={courseData.courses}
                              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 border border-blue-300 rounded-full"
                            >
                              <span>{course?.skill_name}</span>{" "}
                              <FaTimes
                                className="cursor-pointer"
                                onClick={() => removeCourse(courseId)}
                              />
                            </div>
                          );
                        })}

                        <input
                          id="courses-names"
                          disabled
                          placeholder="Select skills"
                          className="flex-grow outline-none bg-surface-100 placeholder-dark-300"
                        />

                        <button
                          type="button"
                          className="text-surface-100 px-2 py-1.5 rounded-md bg-blue-300"
                          onClick={handleSkills}
                        >
                          Create a Skill
                        </button>

                        <select
                          value=""
                          onChange={handleSelectChange}
                          className="flex items-center bg-surface-100 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-8 p-2 sm:text-sm sm:leading-6"
                        >
                          <option value="" disabled>
                            Select a skill
                          </option>

                          {courses?.map((course) => (
                            <option key={course.id} value={course?.skill_name}>
                              {course?.skill_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className=" flex justify-center my-2 items-center w-32 gap-2  text-surface-100 bg-blue-300 px-2 py-3 rounded-xl mr-4 hover:bg-[#4296b3]"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col">
                  <div className="flex justify-between max-md:flex-col">
                    <h2 className="text-xl font-exo font-bold">
                      About the Course
                    </h2>
                  </div>
                  <p className="mt-2 mb-2 text-dark-500 text-justify">
                    {courseData.about}
                  </p>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between max-md:flex-col mt-8 mb-4">
                    <h2 className="text-xl font-exo font-bold">
                      Skills You gain
                    </h2>
                  </div>
                  <div className="flex gap-2 max-md:flex-col">
                    {skills?.length > 0 ? (
                      skills.map((skillName, index) => (
                        <div
                          key={index}
                          className="flex bg-blue-600 w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2"
                        >
                          <p className="uppercase text-[12px] text-blue-300">
                            {skillName}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No skills available</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {skill && (
              <>
                <div className="my-4 sm:mb-0">
                  <label htmlFor="skill">Create a skill</label>
                  <div className="sm:pr-4">
                    <div className="relative w-full h-12 px-2 gap-4 flex items-center border-dark-400 rounded-md border mt-2 py-1.5">
                      <label>Enter a new skill</label>
                      <input
                        id="skill"
                        name="skill"
                        type="text"
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        placeholder="select"
                        className="px-2 block w-80 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                      />
                      <button
                        className="text-surface-100 p-2 rounded-md bg-blue-300"
                        onClick={handleCreateSkill}
                      >
                        Create skill
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center max-md:flex-col mt-8 mb-4">
                <h2 className="text-xl font-exo font-bold">Modules</h2>
                {!isStudent && (
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
                        <FaPlus /> Create Module
                      </p>
                    )}
                  </button>
                )}
              </div>

              {isCreatingModule && (
                <>
                  <label className="">Module name</label>
                  <input
                    className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                    value={moduleName}
                    placeholder="Enter module name"
                    title="Enter module name"
                    onChange={(e) => setModuleName(e.target.value)}
                  />
                  <label className=""> Description</label>
                  <input
                    placeholder="Enter module description"
                    title="Enter module description"
                    className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                    value={moduleDesc}
                    onChange={(e) => setModuleDesc(e.target.value)}
                  />

                  {fileUploaded && (
                    <p className="flex items-center text-blue-300 my-4 hover:cursor-pointer">
                      Uploaded File: {fileUploaded}
                    </p>
                  )}
                  <div className="flex ">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      className="flex justify-center items-center gap-2 mt-4 text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-[#4296b3]"
                      onClick={() =>
                        document.querySelector('input[type="file"]').click()
                      }
                    >
                      <FaUpload />
                      Upload File
                    </button>
                    <button
                      className=" flex justify-center items-center gap-2 mt-4 text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-[#4296b3]"
                      onClick={handleCreateModule}
                    >
                      <FaCheck /> Create Module
                    </button>
                  </div>
                </>
              )}

              {modules?.length > 0 ? (
                modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="border border-dark-300 rounded-xl px-4"
                  >
                    <div className="flex justify-between ">
                      <p className="text-dark-300 my-4"> Module {index + 1}</p>
                      {!isStudent && (
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
                              </p>
                            ) : (
                              <p className="flex justify-center items-center gap-2">
                                <FaEdit />
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
                ))
              ) : (
                <p>No modules available.</p>
              )}
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
