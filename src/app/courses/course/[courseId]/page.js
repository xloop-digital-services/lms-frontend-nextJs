"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  createModule,
  createSkill,
  deleteModule,
  getAllSkillCourses,
  getCourseById,
  getInstructorSessionsbyCourseId,
  getModuleByCourseId,
  getProgressForCourse,
  getUserSessions,
  listSessionByCourseId,
  updateCourse,
  updateModule,
} from "@/api/route";
import CourseHead from "@/components/CourseHead";
import { useSidebar } from "@/providers/useSidebar";
import { CircularProgress } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import useClickOutside from "@/providers/useClickOutside";
import {
  FaCheck,
  FaEdit,
  FaFileDownload,
  FaPlus,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { useAuth } from "@/providers/AuthContext";
import { toast } from "react-toastify";
import UploadContent from "@/components/Modal/UploadFile";
import DeleteConfirmationPopup from "@/components/Modal/DeleteConfirmationPopUp";
import { handleFileUploadToS3 } from "@/components/ApplicationForm";
import { formatDateTime } from "@/components/AdminDataStructure";
import Link from "next/link";

export const downloadFile = async (filePath) => {
  if (!filePath) return;
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
  const [loader, setLoader] = useState(false);
  const [loaderModule, setLoaderModule] = useState(false);
  const [loaderSkills, setLoaderSkills] = useState(false);
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
  const [adminUserId, setAdminUserId] = useState("");
  const group = userData?.Group;
  const isInstructor = userData?.Group === "instructor";
  const [sessions, setSessions] = useState([]);
  const [sessionsUser, setSessionsUser] = useState([]);
  const [session, setSession] = useState(null);
  const [studentInstructorName, setStudentInstructorName] = useState(null);
  const [selectedSession, setSelectedSession] = useState();
  const userId = group === "instructor" ? userData?.User?.id : adminUserId;
  const [sessionId, setSessionId] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [skill, setSkill] = useState();
  const [moduleStatus, setModuleStatus] = useState(0);
  // //console.log(isAdmin)
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const sessionButton = useRef(null);
  const sessionDropdown = useRef(null);
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
        //console.error("Failed to fetch course, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }
  useClickOutside(sessionDropdown, sessionButton, () =>
    setIsSessionOpen(false)
  );
  const toggleSessionOpen = () => {
    setIsSessionOpen(!isSessionOpen);
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session.session_name);
    setSessionId(session.id);
    setIsSessionOpen(false);
  };
  const handleChangeInstructor = (session) => {
    setSelectedSession(session);
    setSessionId(session.session_id);
    setIsSessionOpen(false);
  };
  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoader(true);

    try {
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        //console.log(sessions);
        const coursesData = sessions.map((session) => {
          return {
            course: session.course,
            instructorName:
              session.instructor?.instructor_name || "To be Assigned",
          };
        });
        const foundSession = sessions.find(
          (session) => Number(session.course?.id) === Number(courseId)
        );

        if (isStudent && foundSession) {
          setSessionId(foundSession.id);
          setStudentInstructorName(
            foundSession.instructor?.instructor_name || "To be Assigned"
          );
        }
      } else {
      }
    } catch (error) {
      //console.log("Error:", error);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    fetchSessionForUser();
  }, [isStudent]);

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    const skills = {
      skill_name: skillName,
    };

    setLoaderSkills(true);

    try {
      const response = await createSkill(skills);
      if (response.status === 201) {
        toast.success("Skill created Successfully!");
        setSkill(false);
        fetchAllSkills();
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      toast.error(`Error creating skill: ${error?.message}`);
    } finally {
      setLoaderSkills(false);
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
        //console.log(response?.data?.data);
        setLoader(false);
      } else {
        //console.error("Failed to fetch skills, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
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
        // console.error(
        //   "Failed to fetch course progress, status:",
        //   response.status
        // );
      }
    } catch (error) {
      //console.log("error", error);
    }
  }
  async function fetchAllSkills() {
    try {
      const response = await getAllSkillCourses();
      if (response.status === 200) {
        setCourses(response.data?.data);
      } else {
        //console.error("Failed to fetch courses, status:", response.status);
      }
    } catch (error) {
      //console.error("Error fetching courses:", error);
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
      //console.error("Skill not found");
    }
  };

  const removeCourse = (courseToRemove) => {
    setInputCourses(inputCourses.filter((course) => course !== courseToRemove));
  };

  async function fetchModules() {
    const response = await getModuleByCourseId(courseId, sessionId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setModules(response?.data?.data);
        setLoader(false);
      } else {
        //console.error("Failed to fetch modules, status:", response.status);
        setLoader(false);
      }
    } catch (error) {
      //console.log("error", error);
      setLoader(false);
    }
  }

  // //console.log(file);
  const handleCreateModule = async (event) => {
    event.preventDefault();
    setLoaderModule(true);
    if (!selectedSession) {
      toast.error("No session selected");
      setLoaderModule(false);
      return;
    }

    const moduleData = {
      name: moduleName,
      description: moduleDesc,
      course: courseId,
      session: sessionId,
      status: moduleStatus,
    };

    try {
      if (!sessionId) {
        toast.error("Select a session to create the module.");
        setLoaderModule(false);
        return;
      }
      const formData = new FormData();
      formData.append("name", moduleData.name);
      formData.append("description", moduleData.description);
      formData.append("course", moduleData.course);
      formData.append("session", sessionId);
      formData.append("status", moduleStatus);

      if (file) {
        const s3Data = await handleFileUploadToS3(file, "Upload Modules");
        if (s3Data) {
          formData.append("files", s3Data);
        }
      }
      const response = await createModule(formData);

      if (response.status === 201) {
        toast.success("Module created successfully!");
        setModuleName("");
        setModuleDesc("");
        setFile(null);
        setFileUploaded(null);
        setCreatingModule(false);
        fetchModules();
      } else {
        toast.error(response.data?.message || "Failed to create module.");
      }
    } catch (error) {
      toast.error(`Error creating module: ${error.message}`);
    } finally {
      setLoaderModule(false);
    }
  };

  const handleModuleID = (id) => {
    setModuleId(id);
  };

  const resetFields = () => {
    setModuleName("");
    setModuleDesc("");
    setFileUploaded(null);
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
    setLoaderModule(true);
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
            file: fileItem.file,
          }));
        }

        if (file && file instanceof File) {
          const uploadedFile = await handleFileUploadToS3(
            file,
            "Upload Modules"
          );
          moduleData.files.push({
            file: uploadedFile,
            module_id: moduleId,
          });
        }
      }

      let filesToUpload =
        moduleData.files.length > 0
          ? moduleData.files.map((fileItem) => fileItem.file)
          : [];

      const formData = new FormData();
      formData.append("name", moduleData.name);
      formData.append("description", moduleData.description);
      formData.append("course", moduleData.course);

      filesToUpload.forEach((file) => formData.append("files", file));

      formData.append("session", sessionId);

      const response = await updateModule(formData, moduleId);
      if (response.status === 200) {
        toast.success("Module updated successfully!");
        setIsEditingModule(false);
        setModuleId(null);
        fetchModules();
        setFileUploaded();
        setFile(null);
      } else {
        toast.error(`Failed to update module, status: ${response.status}`);
      }
    } catch (error) {
      toast.error(`Error updating module: ${error.message}`);
      //console.log("Error updating module:", error);
    } finally {
      setLoaderModule(false);
    }
  }

  const handleModuleStatus = async (id, currentStatus) => {
    const moduleToUpdate = modules?.find((mod) => mod.id === id);
    if (!moduleToUpdate) {
      toast.error("Module not found");
      return;
    }

    const newStatus = currentStatus === 1 ? 0 : 1;
    const formData = new FormData();
    formData.append("status", newStatus);

    try {
      const response = await deleteModule(formData, id);
      if (response.status === 200) {
        toast.success("Module status updated successfully!");
        setModules((prevModules) =>
          prevModules.map((mod) =>
            mod.id === id ? { ...mod, status: newStatus } : mod
          )
        );
      } else {
        toast.error("Error updating module status");
      }
    } catch (error) {
      toast.error("Error updating module status", error);
      //console.error(error);
    }
  };

  const handleDeleteModule = async (id) => {
    const moduletoDelete = modules?.find((mod) => mod.id === id);
    //console.log(id);
    if (!moduletoDelete) {
      toast.error("Module not found");
      return;
    }

    const formData = new FormData();
    formData.append("status", 2);

    try {
      const response = await deleteModule(formData, id);
      if (response.status === 200) {
        toast.success("Module deleted successfully!");
        fetchModules();
      } else {
        toast.error("Error deleting module", response?.message);
      }
    } catch (error) {
      toast.error("Error deleting module", error);
      //console.error(error);
    }
  };

  const handleDeleteClick = (moduleId) => {
    setSelectedModule(moduleId);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      if (handleDeleteModule) {
        await handleDeleteModule(selectedModule);
        setConfirmDelete(false);
      }
    } catch (error) {
      //console.error("Error deleting the module", error);
    }
  };

  // //console.log(sessionId);
  useEffect(() => {
    if (!sessionId) return;
    fetchModules();
  }, [sessionId]);

  useEffect(() => {
    {
      isStudent && fetchCourseProgress();
    }
  }, [courseId, isStudent]);

  useEffect(() => {
    if (!courseId) return;
    fetchCoursesById();
    fetchAllSkills();
  }, [courseId]);

  const handleChange = (e) => {
    const [selectedSessionId, internalSessionId] = e.target.value.split("|");
    const selectedSession = sessions.find(
      (session) => session?.session_id === selectedSessionId
    );
    setSelectedSession(e.target.value);
    setSessionId(internalSessionId);
  };

  async function fetchSessions() {
    const response = await listSessionByCourseId(courseId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setSessions(response.data.data);
        setLoader(false);
      } else {
        //console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }

  async function fetchSessionsInstructor() {
    const response = await getInstructorSessionsbyCourseId(
      userId,
      group,
      courseId
    );

    try {
      if (response.status === 200) {
        setSessions(response.data.data);
      } else {
        //console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }

  useEffect(() => {
    if (!isInstructor) return;
    fetchSessionsInstructor();
  }, [userData, isInstructor]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchSessions();
  }, [sessionId, selectedSession, isAdmin]);
  return (
    <>
      {loader ? (
        <div className="flex h-full justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div
          className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${isSidebarOpen
              ? "translate-x-64 ml-20 "
              : "translate-x-0 pl-10 pr-10 max-md:pl-2 max-md:pr-2"
            }`}
          style={{ width: isSidebarOpen ? "81%" : "100%" }}
        >
          <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
            <CourseHead
              id={courseId}
              program="course"
              setFetch={setFetch}
              progress={courseProgress?.progress_percentage}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
              title="Edit course"
              instructorName={
                studentInstructorName ? studentInstructorName : ""
              }
            />

            {isEditing ? (
              <div className="flex flex-col">
                <div>
                  <div className="flex justify-between my-2 max-sm:flex-col">
                    <label className="text-lg font-exo text-blue-500 font-bold cursor-default">
                      Course Name
                    </label>
                    <div className="flex items-center">
                      <span className="mr-4 text-md cursor-default">
                        Course Status
                      </span>
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
                          className={`absolute w-4 h-4 bg-blue-300 rounded-full shadow-md transform transition-transform ${courseStatus === 1
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
                <label className="text-lg mt-2 text-blue-500 font-exo font-bold">
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
                <label className="font-exo text-blue-500 text-lg font-bold mt-4">
                  About the Course
                </label>
                <textarea
                  rows="3"
                  className="px-2 block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6 max-sm:scrollbar-webkit"
                  value={courseData.about}
                  onChange={(e) =>
                    setCourseData({ ...courseData, about: e.target.value })
                  }
                />

                <div className="my-4 sm:mb-0">
                  <label className="text-lg  text-blue-500 font-exo font-bold">
                    Credit Hours
                  </label>
                  <div className="max-sm:pr-4">
                    <div className="relative w-full h-auto px-2 gap-2 sm:gap-4 flex flex-wrap items-center border-dark-400 rounded-md border mt-2 py-1.5">
                      <span className="text-sm sm:text-base">Theory Hours</span>
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
                        className="px-2 block w-16 sm:w-20 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset text-xs sm:text-sm"
                      />
                      <span className="text-sm sm:text-base">
                        Lab/Practical Hours
                      </span>
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
                        className="px-2 block w-16 sm:w-20 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="my-4 sm:mb-0">
                    <label className="text-lg  text-blue-500 font-exo font-bold">
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
                  className=" flex justify-center my-2 items-center w-32 gap-2  text-surface-100 bg-blue-300 px-2 py-3 rounded-xl mr-4 hover:bg-blue-700"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col">
                  <div className="flex justify-between max-md:flex-col">
                    <h2 className="text-xl text-blue-500 font-exo font-bold">
                      About the Course
                    </h2>
                  </div>
                  <p className="mt-2 mb-2 text-dark-500 text-justify">
                    {courseData.about}
                  </p>
                </div>
                <div className="flex flex-col mt-2">
                  <h2 className="text-xl text-blue-500 font-exo font-bold mb-2">
                    Course Activities
                  </h2>
                  <Link
                    href={`/assignment/course/${courseId}`}
                    className="text-lg text-dark-500 hover:underline"
                  >
                    Assignments{" "}
                  </Link>
                  <Link
                    href={`/quiz/course/${courseId}`}
                    className="text-lg text-dark-500 hover:underline"
                  >
                    {" "}
                    Quizzes{" "}
                  </Link>
                  <Link
                    href={`/project/course/${courseId}`}
                    className="text-lg text-dark-500 hover:underline"
                  >
                    {" "}
                    Project{" "}
                  </Link>
                  <Link
                    href={`/exam/course/${courseId}`}
                    className="text-lg text-dark-500 hover:underline"
                  >
                    {" "}
                    Exam{" "}
                  </Link>
                  <Link
                    href={`/attendance/course/${courseId}`}
                    className="text-lg text-dark-500 hover:underline"
                  >
                    {" "}
                    Attendance{" "}
                  </Link>
                  <Link
                    href={`/grading/course/${courseId}`}
                    className="text-lg text-dark-500 hover:underline"
                  >
                    {" "}
                    Grading{" "}
                  </Link>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between max-md:flex-col mt-4 mb-4 max-sm:my-2">
                    <h2 className="text-xl text-blue-500 font-exo font-bold">
                      Skills You gain
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2 max-md:flex-col">
                    {skills?.length > 0 ? (
                      skills.map((skillName, index) => (
                        <div
                          key={index}
                          className="flex bg-blue-600 py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2"
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
                  <label className=" text-blue-500" htmlFor="skill">
                    Create a skill
                  </label>
                  <div className="sm:pr-4">
                    <div className="relative w-full h-12 px-2 gap-4 flex items-center border-dark-400 rounded-md border mt-2 py-1.5">
                      <label className="">Enter a new skill</label>
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
                        disabled={loaderSkills}
                      >
                        {loaderSkills ? (
                          <CircularProgress size={16} />
                        ) : (
                          "Create skill"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {isAdmin && (
              <div className="relative space-y-2 text-[15px] w-full">
                <p className="text-blue-500 font-semibold mt-4 ">
                  Select Session
                </p>
                <button
                  ref={sessionButton}
                  onClick={toggleSessionOpen}
                  className={`${!selectedSession ? "text-[#92A7BE]" : "text-[#424B55]"
                    } flex justify-between items-center w-full hover:text-[#0E1721] px-4 py-3 text-sm text-left bg-surface-100 border border-[#ACC5E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedSession || "Select a session"}
                  <span
                    className={
                      isSessionOpen ? "rotate-180 duration-300" : "duration-300"
                    }
                  >
                    <IoIosArrowDown />
                  </span>
                </button>
                {isSessionOpen && (
                  <div
                    ref={sessionDropdown}
                    className="absolute top-full left-0 z-20 w-full lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {Array.isArray(sessions) && sessions.length > 0 ? (
                      sessions.map((session, index) => (
                        <div
                          key={index}
                          onClick={() => handleSessionSelect(session)}
                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                            {session.session_name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No sessions available
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {isInstructor && (
              <div className="relative space-y-2 text-[15px] w-full mt-4">
                <p className="text-blue-500 font-semibold">Select Session</p>
                <button
                  ref={sessionButton}
                  onClick={toggleSessionOpen}
                  className={`${!selectedSession ? "text-[#92A7BE]" : "text-[#424B55]"
                    } flex justify-between items-center w-full hover:text-[#0E1721] px-4 py-3 text-sm text-left bg-surface-100 border border-[#ACC5E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedSession
                    ? `${selectedSession.session_name}`
                    : "Select a session"}
                  <span
                    className={
                      isSessionOpen ? "rotate-180 duration-300" : "duration-300"
                    }
                  >
                    <IoIosArrowDown />
                  </span>
                </button>
                {isSessionOpen && (
                  <div
                    ref={sessionDropdown}
                    className="absolute top-full left-0 z-20 w-full lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {Array.isArray(sessions) && sessions.length > 0 ? (
                      sessions.map((session) => (
                        <div
                          key={session.session_id}
                          onClick={() => handleChangeInstructor(session)}
                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                            {session.session_name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No sessions available
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center max-md:flex-col mt-4">
                <h2 className="text-xl font-exo text-blue-500 font-bold">
                  Modules
                </h2>

                {!isStudent && (
                  <button
                    className=" flex justify-center items-center gap-2  text-surface-100 bg-blue-300 p-4 rounded-xl hover:bg-blue-700"
                    onClick={() => {
                      if (isCreatingModule) {
                        resetFields();
                      }
                      setCreatingModule(!isCreatingModule);
                    }}
                    disabled={loader}
                  >
                    {loader ? (
                      <CircularProgress size={20} style={{ color: "white" }} />
                    ) : isCreatingModule ? (
                      <p className="flex justify-center items-center gap-2">
                        <FaTimes />
                        Cancel
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
                <div>
                  <div className="flex items-center justify-between max-md:flex-col">
                    <label className="">Module name</label>
                    <div className="flex items-center my-4">
                      <span className="mr-4 text-md">Module Status</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={moduleStatus === 1}
                          onChange={async () => {
                            const newStatus = moduleStatus === 0 ? 1 : 0;
                            setModuleStatus(newStatus);
                            await handleModuleStatus(moduleId);
                          }}
                          className="sr-only"
                        />
                        <div className="w-11 h-6 bg-blue-600 rounded-full"></div>
                        <div
                          className={`absolute w-4 h-4 bg-blue-300 rounded-full shadow-md transform transition-transform ${moduleStatus === 1
                              ? "translate-x-5"
                              : "translate-x-1"
                            }`}
                        ></div>
                      </label>
                      <span className="ml-4 text-md">
                        {moduleStatus === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <input
                    className="block w-full mb-4 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                    value={moduleName}
                    placeholder="Enter module name"
                    title="Enter module name"
                    onChange={(e) => setModuleName(e.target.value)}
                  />
                  <label className="my-4"> Description</label>
                  <input
                    placeholder="Enter module description"
                    title="Enter module description"
                    className="block mt-4 w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
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
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      className="flex justify-center items-center gap-2 mt-4 text-surface-100 bg-blue-300 p-4 rounded-xl mr-4  hover:bg-blue-700"
                      onClick={() =>
                        document.querySelector('input[type="file"]').click()
                      }
                    >
                      <FaUpload />
                      Upload File
                    </button>
                    <button
                      className={`w-88 flex justify-center items-center gap-2 mt-4 p-4 max-sm:p-2 rounded-xl mr-4 max-sm:text-sm ${loaderModule
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-300 hover:bg-blue-700"
                        } text-surface-100`}
                      onClick={handleCreateModule}
                      disabled={loaderModule}
                    >
                      {loaderModule ? (
                        <CircularProgress
                          size={20}
                          style={{ color: "white" }}
                        />
                      ) : (
                        <>
                          <FaCheck /> Create Module
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {modules?.length > 0 ? (
                modules
                  .slice()
                  .reverse()
                  .map((module, index) => (
                    <div
                      key={module.id}
                      className="border border-dark-300 rounded-xl px-4 max-sm:flex max-sm:flex-col max-sm:items-center"
                    >
                      <div className="flex justify-between max-sm:items-center max-sm:flex-col  ">
                        <p className="text-dark-300 my-4">
                          {" "}
                          Module {modules.length - index}
                        </p>

                        {!isStudent && (
                          <div className="flex max-sm:flex-col">
                            {moduleId !== module.id && (
                              <div className="flex max-sm:justify-center text-center gap-1 items-center mx-4 mt-4 max-sm:mx-1">
                                <span className="mr-4 text-md">
                                  Module Status
                                </span>
                                <label
                                  className={`relative inline-flex items-center ${module.status === 1
                                      ? "cursor-not-allowed"
                                      : "cursor-pointer"
                                    }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={module.status === 1}
                                    disabled={module.status === 1}
                                    onChange={() =>
                                      handleModuleStatus(
                                        module.id,
                                        module.status
                                      )
                                    }
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-11 h-6 rounded-full ${module.status === 1
                                        ? "bg-dark-100"
                                        : "bg-blue-600"
                                      }`}
                                  ></div>
                                  <div
                                    className={`absolute w-4 h-4 rounded-full shadow-md transform transition-transform ${module.status === 1
                                        ? "translate-x-5 bg-dark-200"
                                        : "translate-x-1 bg-blue-300"
                                      }`}
                                  ></div>
                                </label>
                                <span className="ml-4 text-md">
                                  {module.status === 1 ? "Active" : "Inactive"}
                                </span>
                              </div>
                            )}

                            <button
                              className=" flex justify-center mt-4 items-center gap-2  text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-blue-700"
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
                            <button
                              onClick={() => handleDeleteClick(module.id)}
                              title="Delete Module"
                              className={`flex justify-center mt-4 items-center gap-2 text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-blue-700 ${moduleId === module.id ? "hidden" : ""
                                }`}
                            >
                              <p className="flex justify-center items-center gap-2">
                                <FaTrash />
                              </p>
                            </button>

                            {moduleId === module.id && (
                              <>
                                <button
                                  className={`flex justify-center items-center gap-2 mt-4 p-4 rounded-xl mr-4 ${loaderModule
                                      ? "bg-blue-300 cursor-not-allowed"
                                      : "bg-blue-300 hover:bg-blue-700"
                                    } text-surface-100`}
                                  onClick={handleSaveModule}
                                  disabled={loaderModule}
                                >
                                  {loaderModule ? (
                                    <CircularProgress
                                      size={20}
                                      style={{ color: "white" }}
                                    />
                                  ) : (
                                    <>
                                      <FaCheck />
                                    </>
                                  )}
                                </button>

                                <input
                                  type="file"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                                <button
                                  className="flex justify-center items-center gap-2 mt-4 text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-blue-700"
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
                            )}
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
                        <p className="font-bold text-blue-500 my-2">
                          {module.name}
                        </p>
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
                          className="flex justify-between max-md:flex-col"
                          key={file.id}
                        >
                          <div className="flex items-center gap-2 group">
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
                          <div className="flex my-4 items-center justify-center p-2 h-8 bg-blue-600 text-blue-300 rounded-md">
                            {`Posted on: ${formatDateTime(module.created_at)}`}
                          </div>
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
      {confirmDelete && (
        <DeleteConfirmationPopup
          setConfirmDelete={setConfirmDelete}
          handleDelete={handleDelete}
          field="Module"
        />
      )}
    </>
  );
}
