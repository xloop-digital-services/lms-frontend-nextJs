"use client";
import {
  getAllCourses,
  getCourseById,
  getProgramById,
  updateProgram,
} from "@/api/route";
import CourseCard from "@/components/CourseCard";
import CourseHead from "@/components/CourseHead";
import { useSidebar } from "@/providers/useSidebar";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import courseImg from "/public/assets/img/course-image.png";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "@/providers/AuthContext";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import useClickOutside from "@/providers/useClickOutside";

export default function Page({ params }) {
  const { isSidebarOpen } = useSidebar();
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const courseButtonRef = useRef(null);
  const courseDropdownRef = useRef(null);
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const programId = params.programId;
  const [isEditing, setIsEditing] = useState(false);
  const [programData, setProgramData] = useState({});
  const [courseData, setCourseData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [inputCourses, setInputCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [programStatus, setProgramStatus] = useState(0);
  const displayedCourses = new Set();

  useClickOutside(courseDropdownRef, courseButtonRef, () =>
    setIsCourseOpen(false)
  );

  async function fetchProgramById() {
    try {
      const response = await getProgramById(programId);
      setLoader(true);
      if (response.status === 200) {
        const program = response?.data?.data;
        setProgramStatus(program?.status);
        //console.log(programStatus);
        setProgramData(program);

        if (program.courses && program.courses.length > 0) {
          const courses = await Promise.all(
            program.courses.map(async (courseId) => {
              const courseResponse = await getCourseById(courseId);
              return courseResponse?.data?.data;
            })
          );
          setCourseData(courses);
        }
        setLoader(false);
      } else {
        //console.error("Failed to fetch program, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    }
  }

  async function handleSave() {
    try {
      const updatedProgramData = {
        ...programData,
        status: programStatus,
        courses: [...programData.courses, ...inputCourses],
      };

      const response = await updateProgram(updatedProgramData, programId);
      if (response.status === 200) {
        toast.success("Program updated successfully!");
        setIsEditing(false);
        fetchProgramById();
      } else {
        toast.error("Failed to update the program, status:", response.status, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // //console.error("Failed to update program, status:", response.status);
      }
    } catch (error) {
      toast.error("Error updating program:", error, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // //console.log("Error updating program:", error);
    }
  }

  const toggleCourseOpen = () => {
    setIsCourseOpen(!isCourseOpen);
  };

  const handleSelectChange = (course) => {
    const selectedName = course.name;
    const Course = courses.find((course) => course.name === selectedName);

    if (Course) {
      if (!selectedCourse.includes(selectedCourse.id)) {
        setSelectedCourse((prevCourses) => [...prevCourses, Course.id]);
      } else {
        toast.error("This course is already selected.");
      }
    } else {
      //console.error("Course not found");
    }
  };

  async function fetchAllCourses() {
    try {
      const response = await getAllCourses();
      if (response.status === 200) {
        setCourses(response.data?.data);
      } else {
        //console.error("Failed to fetch courses, status:", response.status);
      }
    } catch (error) {
      //console.error("Error fetching courses:", error);
    }
  }

  const removeCourse = (courseToRemove) => {
    setSelectedCourse((prevCourses) =>
      prevCourses.filter((courseId) => courseId !== courseToRemove)
    );
    setCourseData((prevCourses) =>
      prevCourses.filter((course) => course.id !== courseToRemove)
    );

    setProgramData((prevProgramData) => ({
      ...prevProgramData,
      courses: prevProgramData.courses.filter(
        (courseId) => courseId !== courseToRemove
      ),
    }));
  };

  useEffect(() => {
    fetchAllCourses();
    fetchProgramById();
  }, []);

  // //console.log(programData.short_description)
  return (
    <>
      {loader ? (
        <div className="flex h-screen justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div
          className={`flex-1 transition-transform pt-[90px] space-y-4 max-md:pt-32 font-inter ${
            isSidebarOpen
              ? "translate-x-64 ml-20 "
              : "translate-x-0 pl-10 pr-10 max-md:pl-2 max-md:pr-2"
          }`}
          style={{ width: isSidebarOpen ? "81%" : "100%" }}
        >
          <div className="bg-surface-100 mx-4 my-3 px-6 py-8 rounded-xl p-4">
            <CourseHead
              name={programData.name}
              id={programId}
              chr={null}
              program="program"
              setFetch={setFetch}
              title="Edit program"
              setIsEditing={setIsEditing}
              isEditing={isEditing}
              programAbb={programData.program_abb}
            />

            {isEditing ? (
              <div className="flex flex-col ">
                <div>
                  <div className="flex justify-between my-2">
                    <div className="flex items-center">
                      <span className="mr-4 text-md text-blue-500">
                        Program Status
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={programStatus === 1}
                          onChange={() =>
                            setProgramStatus((prevStatus) =>
                              prevStatus === 0 ? 1 : 0
                            )
                          }
                          className="sr-only"
                        />
                        <div className="w-11 h-6 bg-blue-600 rounded-full"></div>
                        <div
                          className={`absolute w-4 h-4 bg-blue-300 rounded-full shadow-md transform transition-transform ${
                            programStatus === 1
                              ? "translate-x-5"
                              : "translate-x-1"
                          }`}
                        ></div>
                      </label>
                      <span className="ml-4 text-md">
                        {programStatus === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex max-md:flex-col w-full my-2">
                  <div className="flex-col w-full">
                    <label className="text-lg text-blue-500 font-exo font-bold">
                      Program Name
                    </label>
                    <input
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                      value={programData.name}
                      onChange={(e) =>
                        setProgramData({ ...programData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex-col max-md:mt-4">
                    <label className="text-lg ml-2 text-blue-500 max-md:ml-0 font-exo font-bold">
                      Program Abbreviation
                    </label>
                    <input
                      className="block ml-2 max-md:ml-0  max-md:w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                      value={programData.program_abb}
                      onChange={(e) =>
                        setProgramData({
                          ...programData,
                          program_abb: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <label className="text-lg text-blue-500 font-bold">
                  Short Description
                </label>
                <input
                  className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                  value={programData.short_description}
                  onChange={(e) =>
                    setProgramData({
                      ...programData,
                      short_description: e.target.value,
                    })
                  }
                />
                <label className=" font-exo text-blue-500 text-lg font-bold mt-4">
                  About the Program
                </label>
                <textarea
                  rows="3"
                  className="px-2 block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset sm:text-sm sm:leading-6"
                  value={programData.about}
                  onChange={(e) =>
                    setProgramData({ ...programData, about: e.target.value })
                  }
                />
                <label className="font-exo text-blue-500 text-lg font-bold mt-4 sm:text-base">
                  Selected courses
                </label>
                <div className="relative flex flex-wrap items-center gap-2 bg-white outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 shadow-sm ring-1 ring-inset focus:ring-inset p-2 text-sm leading-6 max-sm:flex-col">
                  {courseData?.map((course) => {
                    if (displayedCourses.has(course.id)) return null;
                    displayedCourses.add(course.id);

                    return (
                      <div
                        key={course.id}
                        className="flex items-center space-x-2 px-3 py-1 bg-blue-600 border border-blue-300 rounded-full text-white text-xs sm:text-sm max-sm:mb-2"
                      >
                        <span>{course?.name}</span>
                        <FaTimes
                          className="cursor-pointer"
                          onClick={() => removeCourse(course.id)}
                        />
                      </div>
                    );
                  })}

                  {selectedCourse?.map((courseId) => {
                    if (displayedCourses.has(courseId)) return null;
                    displayedCourses.add(courseId);

                    const course = courses.find((c) => c.id === courseId);
                    return (
                      <div
                        key={courseId}
                        className="flex items-center space-x-2 px-3 py-1 bg-blue-600 border border-blue-300 rounded-full text-white text-xs sm:text-sm max-sm:mb-2"
                      >
                        <span>{course?.name}</span>
                        <FaTimes
                          className="cursor-pointer"
                          onClick={() => removeCourse(courseId)}
                        />
                      </div>
                    );
                  })}

                  <div className="relative w-full">
                    <button
                      ref={courseButtonRef}
                      onClick={toggleCourseOpen}
                      className={`${
                        !selectedCourse ? "text-[#92A7BE]" : "text-[#424B55]"
                      } flex justify-between items-center w-full hover:text-[#0E1721] px-4 py-2 text-sm text-left bg-surface-100 border border-[#ACC5E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                    >
                      {"Select a course"}
                      <span
                        className={
                          isCourseOpen
                            ? "rotate-180 transition-transform"
                            : "transition-transform"
                        }
                      >
                        <IoIosArrowDown />
                      </span>
                    </button>

                    {isCourseOpen && (
                      <div
                        ref={courseDropdownRef}
                        className="absolute top-full mt-1 left-0 z-20 w-full lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                      >
                        {courses && courses.length > 0 ? (
                          courses.map((course) => (
                            <div
                              key={course.id}
                              onClick={() => handleSelectChange(course)}
                              className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700 text-sm"
                            >
                              {course.name}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-gray-500 text-center text-sm">
                            No courses available
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className=" flex justify-center my-2 items-center w-32 max-sm:w-full gap-2  text-surface-100 bg-blue-300 px-2 py-3 rounded-xl mr-4 hover:bg-[#4296b3]"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex justify-between max-md:flex-col">
                  <h2 className="text-xl text-blue-500 font-exo font-bold">
                    About the Program
                  </h2>
                </div>
                <p className="mt-2 mb-2 text-dark-500 text-justify">
                  {programData.about}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex justify-between max-md:flex-col mt-8 ">
                <h2 className="text-xl text-blue-500 font-exo font-bold">
                  Courses of {programData.name}
                </h2>
              </div>

              {/* {isStudent ? ( */}
              <div className="flex flex-wrap max-md:w-full max-sm:items-center max-sm:justify-center">
                {courseData?.map((course, index) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    courseName={course.name}
                    courseDesc={course.short_description}
                    image={courseImg}
                    route={`course`}
                    route1="courses"
                    status={course.status}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
