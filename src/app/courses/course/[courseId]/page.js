"use client";
import React, { useEffect, useState } from "react";
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
import axios from "axios";
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
import { Upload, UploadFile } from "@mui/icons-material";
import UploadContent from "@/components/Modal/UploadFile";
import DeleteConfirmationPopup from "@/components/Modal/DeleteConfirmationPopUp";
import { handleFileUploadToS3 } from "@/components/ApplicationForm";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export const downloadFile = async (filePath) => {
  console.log("ye raha", filePath);
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
  const router = useRouter();
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

  async function fetchSessionForUser() {
    const response = await getUserSessions();
    setLoader(true);

    try {
      if (response.status === 200) {
        const sessions = response.data?.session || [];
        console.log(sessions);
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
        console.error(
          "Failed to fetch user sessions, status:",
          response.status
        );
      }
    } catch (error) {
      console.log("Error:", error);
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
    const response = await getModuleByCourseId(courseId, sessionId);
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
    setLoader(true);

    if (!selectedSession) {
      toast.error("No session selected");
      setLoader(false);
      return;
    }

    const moduleData = {
      name: moduleName,
      description: moduleDesc,
      course: courseId,
      files: file,
      session: sessionId,
      status: moduleStatus,
    };

    try {
      if (!sessionId) {
        toast.error("Select a session to create the assignment.");
        setLoader(false);
        return;
      }

      const s3Data = await handleFileUploadToS3(file, "Upload Modules");
      console.log("S3 Data:", s3Data);

      const formData = new FormData();
      formData.append("name", moduleData.name);
      formData.append("description", moduleData.description);
      formData.append("course", moduleData.course);
      formData.append("files", s3Data);
      formData.append("session", sessionId);
      formData.append("status", moduleStatus);

      const response = await createModule(moduleData);

      if (response.status === 201) {
        toast.success("Module created successfully!");
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
    } finally {
      setLoader(false); // Ensure loader is disabled after the process
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

      const s3Data = await handleFileUploadToS3(file, "Upload Modules");
      console.log("S3 Data:", s3Data);

      const formData = new FormData();
      formData.append("name", moduleData.name);
      formData.append("description", moduleData.description);
      formData.append("course", moduleData.course);
      formData.append("files", s3Data);
      formData.append("session", sessionId);
      formData.append("status", moduleStatus);

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

  const handleDeleteModule = async (id) => {
    const moduletoDelete = modules?.find((mod) => mod.id === id);
    console.log(id);
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
      console.error(error);
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
      console.error("Error deleting the module", error);
    }
  };

  // console.log(sessionId);
  useEffect(() => {
    if (!sessionId) return;
    fetchModules();
  }, [sessionId]);

  useEffect(() => {
    // fetchAllSkills();
    // fetchSkillbyId();
    {
      isStudent && fetchCourseProgress();
    }
    fetchAllSkills();
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    fetchCoursesById();
  }, [courseId]);

  const handleChange = (e) => {
    const [selectedSessionId, internalSessionId] = e.target.value.split("|");
    const selectedSession = sessions.find(
      (session) => session?.session_id === selectedSessionId
    );
    setSelectedSession(e.target.value);
    setSessionId(internalSessionId);
  };

  const handleChangeInstructor = (e) => {
    const value = e.target.value;
    setSelectedSession(value);
    setSessionId(value);
  };

  async function fetchSessions() {
    const response = await listSessionByCourseId(courseId);
    setLoader(true);
    try {
      if (response.status === 200) {
        setSessions(response.data.data);
        setLoader(false);
      } else {
        console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
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
        console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
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
          className={`flex-1 transition-transform pt-[97px] space-y-4 max-md:pt-32 font-inter ${
            isSidebarOpen
              ? "translate-x-64 ml-20 "
              : "translate-x-0 pl-10 pr-10 max-md:pl-2 max-md:pr-2"
          }`}
          style={{
            // paddingBottom: "20px",
            width: isSidebarOpen ? "81%" : "100%",
          }}
        >
          <div className="bg-surface-100 mx-4 my-3 px-6 pt-6 pb-8 rounded-xl max-sm:p-0 max-sm:m-0">
            <div
              className="text-dark-300 flex gap-2 items-center cursor-pointer pb-2 hover:text-blue-300 mr-6 "
              onClick={() => router.push(`/courses`)}
            >
              <FaArrowLeftLong size={20} />
              <p>Back</p>
            </div>
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
                  <div className="flex justify-between my-2">
                    <label className="text-lg font-exo text-blue-500 font-bold">
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
                  className="px-2 block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                  value={courseData.about}
                  onChange={(e) =>
                    setCourseData({ ...courseData, about: e.target.value })
                  }
                />

                <div className="my-4 sm:mb-0">
                  <label className="text-lg  text-blue-500 font-exo font-bold">
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
                <div className="flex flex-col">
                  <div className="flex justify-between max-md:flex-col mt-8 mb-4">
                    <h2 className="text-xl text-blue-500 font-exo font-bold">
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
                      >
                        Create skill
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {isAdmin && (
              <div className="w-full mt-4">
                {" "}
                <label className="text-blue-500 font-semibold">
                  Select Session
                </label>
                <select
                  value={selectedSession || ""}
                  onChange={handleChange}
                  className="bg-surface-100 block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                >
                  <option value="" disabled>
                    Select a session
                  </option>
                  {Array.isArray(sessions) && sessions.length > 0 ? (
                    sessions.map((session) => {
                      // console.log("Mapping session:", session);
                      // Combine session_id and instructor_id in value
                      const optionValue = `${session?.session_name}|${session?.id}`;
                      return (
                        <option key={session?.id} value={optionValue}>
                          {session.session_name}
                        </option>
                      );
                    })
                  ) : (
                    <option value="" disabled>
                      No sessions available
                    </option>
                  )}
                </select>
              </div>
            )}
            {isInstructor && (
              <div className="w-full mt-4">
                {" "}
                <label className="text-blue-500 font-semibold">
                  Select Session
                </label>
                <select
                  value={selectedSession || ""}
                  onChange={handleChangeInstructor}
                  className="bg-surface-100 block w-full my-2 p-3 border border-dark-300 rounded-lg placeholder-surface-100 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                >
                  <option value="" disabled>
                    Select a session
                  </option>
                  {Array.isArray(sessions) && sessions.length > 0 ? (
                    sessions.map((session) => {
                      // console.log("Mapping session:", session);
                      const optionValue = `${session.session_id}`;
                      return (
                        <option key={session.session_id} value={optionValue}>
                          {session.location} -{" "}
                          {session.session_name || session.course} -{" "}
                          {session.start_time} - {session.end_time}
                        </option>
                      );
                    })
                  ) : (
                    <option value="" disabled>
                      No sessions available
                    </option>
                  )}
                </select>
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
                    onClick={() => setCreatingModule(!isCreatingModule)}
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
                          onChange={() =>
                            setModuleStatus((prevStatus) =>
                              prevStatus === 0 ? 1 : 0
                            )
                          }
                          className="sr-only"
                        />
                        <div className="w-11 h-6 bg-blue-600 rounded-full"></div>
                        <div
                          className={`absolute w-4 h-4 bg-blue-300 rounded-full shadow-md transform transition-transform ${
                            moduleStatus === 1
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
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      className="flex justify-center items-center gap-2 mt-4 text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-blue-700"
                      onClick={() =>
                        document.querySelector('input[type="file"]').click()
                      }
                    >
                      <FaUpload />
                      Upload File
                    </button>
                    <button
                      className=" flex justify-center items-center gap-2 mt-4 text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-blue-700"
                      onClick={handleCreateModule}
                    >
                      <FaCheck /> Create Module
                    </button>
                  </div>
                </div>
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
                          {moduleId === module.id ? (
                            <div className="flex items-center mx-4 mt-4">
                              <span className="mr-4 text-md">
                                Module Status
                              </span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={moduleStatus === 1}
                                  onChange={() =>
                                    setModuleStatus((prevStatus) =>
                                      prevStatus === 0 ? 1 : 0
                                    )
                                  }
                                  className="sr-only"
                                />
                                <div className="w-11 h-6 bg-blue-600 rounded-full"></div>
                                <div
                                  className={`absolute w-4 h-4 bg-blue-300 rounded-full shadow-md transform transition-transform ${
                                    moduleStatus === 1
                                      ? "translate-x-5"
                                      : "translate-x-1"
                                  }`}
                                ></div>
                              </label>
                              <span className="ml-4 text-md">
                                {moduleStatus === 1 ? "Active" : "Inactive"}
                              </span>
                            </div>
                          ) : (
                            <p
                              className={`flex justify-center px-4 mt-4 items-center gap-2 text-surface-100 rounded-lg mr-4 ${
                                module?.status === 1
                                  ? "bg-mix-300 w-[110px]"
                                  : module?.status === 0
                                  ? "bg-mix-200 w-[110px]"
                                  : "bg-dark-700 w-110px]"
                              }`}
                            >
                              {module.status === 0
                                ? "Inactive"
                                : module.status === 1
                                ? "Active"
                                : "-"}
                            </p>
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
                            className=" flex justify-center mt-4 items-center gap-2  text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-blue-700"
                          >
                            <p className="flex justify-center items-center gap-2">
                              <FaTrash />
                            </p>
                          </button>
                          {moduleId === module.id ? (
                            <>
                              <button
                                className=" flex justify-center items-center gap-2 mt-4 text-surface-100 bg-blue-300 p-4 rounded-xl mr-4 hover:bg-blue-700"
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
