"use client";
import { createProgram, getAllCourses } from "@/api/route";
import CreateField from "@/components/CreateField";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const [courses, setCourses] = useState([]);
  const [creatingProgram, setCreatingProgram] = useState();
  const [programName, setProgramName] = useState("");
  const [coursesNames, setCoursesNames] = useState("");
  const [about, setAbout] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const router = useRouter();

  const [inputCourses, setInputCourses] = useState([]);

  async function fetchAllCourses() {
    try {
      const response = await getAllCourses();
      if (response.status === 200) {
        setCourses(response.data?.data);
      } else {
        console.error("Failed to fetch courses, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const program = {
      name: programName,
      short_description: shortDesc,
      about: about,
      courses: inputCourses,
    };
    try {
      const response = await createProgram(program);
      if (response.status === 201) {
        toast.success("Program created successfully!");
        setCreatingProgram(program);
        setAbout("");
        setCoursesNames([]);
        setProgramName("");
        setShortDesc("");
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      toast.error(`Error creating program: ${error.message}`);
    }
    localStorage.removeItem("programName");
    localStorage.removeItem("shortDesc");
    localStorage.removeItem("about");

    // Optionally, reset the state if needed
    setProgramName("");
    setShortDesc("");
    setAbout("");
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
  useEffect(() => {
    fetchAllCourses();
  }, []);

  return (
    <div>
      <CreateField
        title="Program"
        list="Course"
        route="program"
        create="course"
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
        removeCourse={removeCourse}
        
      />
    </div>
  );
}
