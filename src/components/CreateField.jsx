"use client";
import { createSkill, listAllBatches, listAllLocations } from "@/api/route";
import { useSidebar } from "@/providers/useSidebar";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import SessionCreationModal from "./Modal/SessionCreationModal";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function CreateField({
  title,
  list,
  handleSubmit,
  handleSubmitModule,
  handleSelectChange,
  route,
  programName,
  coursesNames,
  about,
  shortDesc,
  inputCourses,
  setProgramName,
  setInputCourses,
  setAbout,
  setShortDesc,
  setCoursesNames,
  courses,
  setCreatingProgram,
  removeCourse,
  chr,
  setChr,
  chrLab,
  setChrLab,
  fetchAllSkills,
  create,
  programAbb,
  setProgramAbb,
  loader,
  imagePreview,
  setImagePreview,
  handleImageUpload,
}) {
  const router = useRouter();
  const { isSidebarOpen } = useSidebar();
  const [addModule, setAddModule] = useState(false);
  const [module, setModule] = useState("");
  const [moduleName, setModuleName] = "";
  const [moduleDesc, setModuleDesc] = "";
  const [courseId, setCourseId] = "";
  const [skill, setSkill] = useState();
  const [skillName, setSkillName] = useState("");
  const [classSession, setClassTiming] = useState();
  const [selectedDays, setSelectedDays] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [batchOptions, setBatchOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loadingBatch, setLoadingBatch] = useState(true);

  useEffect(() => {
    if (title === "Program") {
      const storedProgramName = localStorage.getItem("programName");
      const storedShortDesc = localStorage.getItem("shortDesc");
      const storedAbout = localStorage.getItem("about");
      const storedProgAbb = localStorage.getItem("programAbb");

      if (storedProgramName) setProgramName(storedProgramName);
      if (storedShortDesc) setShortDesc(storedShortDesc);
      if (storedAbout) setAbout(storedAbout);
      if (storedProgAbb) setProgramAbb(storedProgAbb);
    }
  }, [title]);

  const WEEKDAYS = {
    0: ["Monday", "Mon"],
    1: ["Tuesday", "Tue"],
    2: ["Wednesday", "Wed"],
    3: ["Thursday", "Thu"],
    4: ["Friday", "Fri"],
    5: ["Saturday", "Sat"],
    6: ["Sunday", "Sun"],
  };

  useEffect(() => {
    if (title === "Program") {
      localStorage.setItem("programName", programName);
    }
  }, [programName, title]);

  useEffect(() => {
    if (title === "Program") {
      localStorage.setItem("shortDesc", shortDesc);
    }
  }, [shortDesc, title]);

  useEffect(() => {
    if (title === "Program") {
      localStorage.setItem("about", about);
    }
  }, [about, title]);

  useEffect(() => {
    if (title === "Program") {
      localStorage.setItem("programAbb", programAbb);
    }
  }, [programAbb, title]);

  const handleAddModule = () => {
    setAddModule(!addModule);
  };

  const goBack = () => {
    router.back();
  };

  const handleOpenSessionModal = () => setOpenModal(true);

  const handleCreateModule = async (event) => {
    event.preventDefault();
    const moduleData = {
      name: moduleName,
      description: moduleDesc,
      course: courseId,
    };
    try {
      const response = await createCourse(moduleData);
      if (response.status === 201) {
        toast.success("Module created successfully!");
        setModule(moduleData);
        setModuleName("");
        setModuleDesc("");
        setCourseId("");
        setCoursesNames([]);
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      toast.error(`Error creating course: ${error.message}`);
    }
  };

  const handleListingAllLocations = async () => {
    try {
      const response = await listAllLocations();
      setLocations(response?.data);

      setLoading(false);
    } catch (error) {
      //console.log("Error fetching locations", error);
      if (error?.response?.status === 401) {
        toast.error(error?.response?.data?.code, ": Please Log in again");
      }
      setLoading(false);
    }
  };

  const getBatch = async () => {
    try {
      const response = await listAllBatches();
      // console.log("batches", response?.data);
      const batchOptionsArray = response?.data.map((batch) => batch.batch);
      setBatchOptions(response?.data);
    } catch (error) {
      // console.log("error while fetching the batches", error);
      if (error.message === "Network Error") {
        toast.error(error.message, "Check your internet connection");
      }
    } finally {
      setLoadingBatch(false);
    }
  };

  useEffect(() => {
    getBatch();
    // getLocation();
  }, [openModal]);

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    const skills = {
      skill_name: skillName,
    };
    try {
      const response = await createSkill(skills);
      if (response.status === 201) {
        toast.success("Skill created Successfully!");
        setSkillName("");
        setSkill(false);
        fetchAllSkills();
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      toast.error(`Error creating skill: ${error?.message}`);
      // //console.log(error?.data?.data?.skill_name?.[0])
    }
  };
  const handleSkills = () => {
    setSkill(!skill);
  };

  const handleSession = () => {
    setClassTiming(!classSession);
  };

  useEffect(() => {
    handleListingAllLocations();
  }, []);

  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
          isSidebarOpen ? "translate-x-64 ml-20" : "translate-x-0 pl-10 pr-4"
        }`}
        style={{
          width: isSidebarOpen ? "81%" : "100%",
        }}
      >
        <div className="bg-surface-100 flex flex-col p-8 rounded-xl">
          <div className="flex">
            <div
              className="text-dark-400 flex gap-2 items-center cursor-pointer hover:text-blue-300 mr-4"
              onClick={goBack}
            >
              <FaArrowLeft size={20} />
              {/* <p>Back</p> */}
            </div>
            <h2 className="font-exo text-blue-500 text-xl font-bold">
              Add a {title}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mt-4">
              <div className="my-4 sm:mb-0">
                <div className="sm:pr-4 flex w-full max-md:flex-col">
                  <div className="w-full">
                    <label htmlFor="program-name">{title} Name</label>
                    <div className="relative flex items-center">
                      <input
                        id="program-name"
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                        name="program-name"
                        type="text"
                        placeholder="Enter the program name"
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  {route === "program" && (
                    <div className="ml-2 max-md:mt-4 max-md:ml-0">
                      <label htmlFor="program-abb">{title} Abbreviation</label>
                      <div className="relative flex items-center">
                        <input
                          id="program-abb"
                          value={programAbb}
                          onChange={(e) => setProgramAbb(e.target.value)}
                          name="program-abb"
                          type="text"
                          placeholder="Enter program abbreviation"
                          className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="my-4 sm:mb-0">
                <label htmlFor="short-desc">Short description</label>
                <div className="sm:pr-4">
                  <div className="relative flex items-center">
                    <input
                      id="short-desc"
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      name="short-desc"
                      type="text"
                      placeholder="Enter the short description about the program"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="my-4 sm:mb-0">
                <label htmlFor="about">About the {title}</label>
                <div className="sm:pr-4">
                  <div className="relative flex items-center">
                    <textarea
                      id="about"
                      name="about"
                      rows="3"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Enter the details about the program"
                      className="px-2 block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="my-4 sm:mb-0">
                {route === "program" ? (
                  <label>Course Names</label>
                ) : (
                  <label>Skills Names</label>
                )}
                <div className="sm:pr-4">
                  <div className="rounded-md relative flex flex-col bg-white outline-dark-300 focus:outline-blue-300 font-sans border-0 mt-2 shadow-sm ring-1 ring-inset focus:ring-inset p-2 sm:text-sm sm:leading-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {inputCourses?.map((courseId) => {
                        const course = courses.find((c) => c.id === courseId);
                        return (
                          <div
                            key={courseId}
                            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 border border-blue-300 rounded-full"
                          >
                            <span>{course?.name || course?.skill_name}</span>
                            <FaTimes
                              className="cursor-pointer"
                              onClick={() => removeCourse(courseId)}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        id="courses-names"
                        disabled
                        placeholder={
                          inputCourses.length === 0 && `Select ${list}`
                        }
                        className="flex-grow outline-none bg-surface-100 placeholder-dark-300 w-full sm:w-auto"
                      />
                      <div className="">
                        {create === "course" ? (
                          <Link href={`/${create}s/create-a-${create}`}>
                            <button className="text-surface-100 px-2 py-1.5 rounded-md bg-blue-300 w-full sm:w-auto">
                              Create a {list}
                            </button>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="text-surface-100 px-2 py-1.5 rounded-md bg-blue-300 w-full sm:w-auto"
                            onClick={handleSkills}
                          >
                            Create a {list}
                          </button>
                        )}
                      </div>

                      <select
                        value=""
                        onChange={handleSelectChange}
                        className="w-34 max-sm:w-40 bg-surface-100 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-8 p-2 sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled>
                          Select a {list}
                        </option>
                        {courses?.map((course) => (
                          <option
                            key={course.id}
                            value={course?.name || course?.skill_name}
                            className="bg-surface-100 text-dark-900 rounded-md p-2 hover:bg-blue-50 transition-all duration-200"
                          >
                            {course?.name || course?.skill_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {skill && (
                <>
                  <div className="my-4 sm:mb-0">
                    <label htmlFor="skill">Create a skill</label>
                    <div className="sm:pr-4">
                      <div className="relative w-full flex flex-col sm:flex-row sm:items-center sm:h-12 px-2 gap-4 border-dark-400 rounded-md border mt-2 py-1.5">
                        <label>Enter a new skill</label>
                        <input
                          id="skill"
                          name="skill"
                          type="text"
                          value={skillName}
                          onChange={(e) => setSkillName(e.target.value)}
                          placeholder="select"
                          className="px-2 block w-full sm:w-80 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                        />
                        <button
                          className="text-surface-100 px-2 py-1.5 rounded-md bg-blue-300 w-full sm:w-auto"
                          onClick={handleCreateSkill}
                        >
                          Create skill
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {route !== "courses" && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenSessionModal();
                    }}
                    className=" max-sm:text-sm flex text-center justify-center items-center gap-2 text-surface-100 bg-blue-300 py-2 px-4 mt-4 rounded-md mr-4 hover:bg-[#3272b6]"
                    // onClick={handleSession}
                  >
                    {" "}
                    Schedule a class session
                  </button>
                </>
              )}

              {route === "courses" && (
                <>
                  <div className="my-4 sm:pr-4 sm:mb-0">
                    <label
                    // className="text-lg  text-blue-500 font-exo font-bold"
                    >
                      Credit Hours
                    </label>
                    <div className="">
                      <div className="relative w-full h-auto px-2 gap-2 sm:gap-4 flex flex-wrap items-center border-dark-400 rounded-md border mt-2 py-1.5">
                        <span className="text-sm sm:text-base">
                          Theory Hours
                        </span>

                        <input
                          id="cr-hr-th"
                          name="cr-hr-th"
                          type="number"
                          min={0}
                          value={chr}
                          onChange={(e) => setChr(e.target.value)}
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
                          value={chrLab}
                          onChange={(e) => setChrLab(e.target.value)}
                          className="px-2 block w-16 sm:w-20 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <>
                <div className="my-4 sm:pr-4 sm:mb-0">
                  <label className="">{title} Image</label>
                  <div className=" border border-dark-400 rounded-md mt-2 px-2 py-2 flex items-center">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleImageUpload(e)}
                      className=""
                    />
                  </div>
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt={`${title} image preview`}
                      width={300}
                      height={300}
                      className="mt-4"
                    />
                  )}
                </div>
              </>

              <button
                // onClick={goBack}
                type="submit"
                className=" flex text-center max-sm:text-sm justify-center items-center gap-2 text-surface-100 bg-blue-300 py-2 px-4 mt-4 rounded-md mr-4 hover:bg-[#3272b6]"
              >
                {loader ? <CircularProgress /> : `Create a ${title}`}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div>
        {openModal && (
          <SessionCreationModal
            setOpenModal={setOpenModal}
            LocationOptions={locations}
            setEdit={setEdit}
            edit={edit}
            batchOptions={batchOptions}
            loadingBatch={loadingBatch}
            // batchOptions={batchOptions}
            // loadingLocation={loadingLocation}
            // setUpdateSession={setUpdateSession}
            // updateSession={updateSession}
            // loadingBatch={loadingBatch}
          />
        )}
      </div>
    </>
  );
}
