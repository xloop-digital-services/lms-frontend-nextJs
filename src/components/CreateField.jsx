"use client";
import { createSkill } from "@/api/route";
import { useSidebar } from "@/providers/useSidebar";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

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
}) {
  const { isSidebarOpen } = useSidebar();
  const [addModule, setAddModule] = useState(false);
  const [module, setModule] = useState("");
  const [moduleName, setModuleName] = "";
  const [moduleDesc, setModuleDesc] = "";
  const [courseId, setCourseId] = "";
  const [skill, setSkill] = useState();
  const [skillName, setSkillName] = useState("");

  const handleAddModule = () => {
    setAddModule(!addModule);
  };

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
      // console.log(error?.data?.data?.skill_name?.[0])
    }
  };
  const handleSkills = () => {
    setSkill(!skill);
  };

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20" : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        width: isSidebarOpen ? "84%" : "100%",
      }}
    >
      <div className="bg-surface-100 flex flex-col p-8 rounded-xl">
        <h2 className="font-exo text-xl font-bold">Add a {title}</h2>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mt-4">
            <div className="my-4 sm:mb-0">
              <label htmlFor="program-name">{title} Name</label>
              <div className="sm:pr-4">
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
              <label htmlFor="courses-names">{list}s Names</label>
              <div className="sm:pr-4">
                <div className="relative flex flex-wrap items-center gap-2 bg-white outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 shadow-sm ring-1 ring-inset focus:ring-inset p-2 sm:text-sm sm:leading-6">
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

                  <input
                    id="courses-names"
                    disabled
                    placeholder={`Select ${list}s`}
                    className="flex-grow outline-none bg-surface-100 placeholder-dark-300"
                  />
                  {create === "course" ? (
                    <Link href={`/${create}s/create-a-${create}`}>
                      <button className="text-surface-100 px-2 py-1.5 rounded-md bg-blue-300">
                        {" "}
                        Create a {list}
                      </button>
                    </Link>
                  ) : (
                    <button
                     type="button"
                      className="text-surface-100  px-2 py-1.5  rounded-md bg-blue-300"
                      onClick={handleSkills}
                    >
                      {" "}
                      Create a {list}
                    </button>
                  )}

                  <select
                    value=""
                    onChange={handleSelectChange}
                    className=" flex items-center bg-surface-100 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-8 p-2 sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled>
                      Select a {list}
                    </option>
                    {courses.map((course) => (
                      <option
                        key={course.id}
                        value={course?.name || course?.skill_name}
                      >
                        {course?.name || course?.skill_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

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

            {route === "courses" && (
              <>
                <div className="my-4 sm:mb-0">
                  <label htmlFor="about">Credit Hours</label>
                  <div className="sm:pr-4">
                    <div className="relative w-full h-12 px-2 gap-4 flex items-center border-dark-400 rounded-md border mt-2 py-1.5">
                      Theory Hours and
                      <input
                        id="cr-hr-th"
                        name="cr-hr-th"
                        type="number"
                        min={0}
                        value={chr}
                        onChange={(e) => setChr(e.target.value)}
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
                        value={chrLab}
                        onChange={(e) => setChrLab(e.target.value)}
                        className="px-2 block w-20 outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <button
              type="submit"
              className="flex text-center justify-center items-center gap-2 text-surface-100 bg-blue-300 py-2 px-4 mt-4 rounded-md mr-4 hover:bg-[#4296b3]"
            >
              Create {title}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}