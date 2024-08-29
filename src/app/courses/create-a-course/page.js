"use client";
import { createCourse, createProgram, getAllCourses } from "@/api/route";
import CreateField from "@/components/CreateField";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const [courses, setCourses] = useState([]);
  const [creatingProgram, setCreatingProgram] = useState();
  const [programName, setProgramName] = useState("");
  const [coursesNames, setCoursesNames] = useState("");
  const [about, setAbout] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const[chr, setChr] = useState('');

  const [inputCourses, setInputCourses] = useState([]);

  // async function fetchAllSkills() {
  //   try {
  //     const response = await getAllSkills();
  //     if (response.status === 200) {
  //       setCourses(response.data?.data);
  //     } else {
  //       console.error("Failed to fetch courses, status:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching courses:", error);
  //   }
  // }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const courseData = {
      name: programName,
      short_description: shortDesc,
      about: about,
      skills: inputCourses,
      credit_hours: chr
    };
    try {
      const response = await createCourse(courseData);
      if (response.status === 201) {
        toast.success("Course created successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCreatingProgram(courseData);
        setAbout("");
        setCoursesNames([]);
        setProgramName("");
        setShortDesc("");
        setChr("")
      } else {
        toast.error(response.data?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error(`Error creating course: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selectedCourse = courses.find(
      (course) => course.name === selectedName
    );

    if (selectedCourse) {
      if (!inputCourses.includes(selectedCourse.id)) {
        setInputCourses([...inputCourses, selectedCourse.id]);
      }
    }
  };

  const removeCourse = (courseToRemove) => {
    setInputCourses(inputCourses.filter((course) => course !== courseToRemove));
  };
  // useEffect(() => {
  //   fetchAllSkills();
  // }, []);

  return (
    <div>
      <CreateField
        title="Course"
        list="Skills"
        route="courses"
        handleSubmit={handleSubmit}
        handleSelectChange={handleSelectChange}
        programName={programName}
        coursesNames={coursesNames}
        about={about}
        shortDesc={shortDesc}
        inputCourses={inputCourses}
        setProgramName={setProgramName}
        setInputCourses={setInputCourses}
        setAbout={setAbout}
        setShortDesc={setShortDesc}
        setCoursesNames={setCoursesNames}
        setCreatingProgram={setCreatingProgram}
        courses={courses}
        chr={chr}
        setChr={setChr}
      />
    </div>
  );
}
