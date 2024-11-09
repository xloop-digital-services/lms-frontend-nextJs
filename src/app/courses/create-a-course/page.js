"use client";
import {
  createCourse,
  createProgram,
  getAllCourses,
  getAllSkillCourses,
  getAllSkills,
} from "@/api/route";
import { handleFileUploadToS3 } from "@/components/ApplicationForm";
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
  const [chr, setChr] = useState("");
  const [chrLab, setChrLab] = useState("");
  const router = useRouter();
  const [inputCourses, setInputCourses] = useState([]);
  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const s3Data = await handleFileUploadToS3(file, "Upload Course Thumbnails");
    //console.log("S3 Data:", s3Data);
    const courseData = {
      name: programName,
      short_description: shortDesc,
      about: about,
      skills: inputCourses,
      theory_credit_hours: chr || 0,
      lab_credit_hours: chrLab || 0,
      picture: s3Data,
    };
    try {
      const response = await createCourse(courseData);
      setLoader(true)
      if (response.status === 201) {
        toast.success("Course created successfully!");
        setLoader(false)
        setCreatingProgram(courseData);
        setAbout("");
        setCoursesNames([]);
        setProgramName("");
        setShortDesc("");
        setChr("");
        setChrLab("");
      } else {
        toast.error(response.data?.message);
        setLoader(false)
      }
    } catch (error) {
      toast.error(`Error creating course: ${error.message}`);
      setLoader(false)
    }
  };

  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selectedCourse = courses.find(
      (course) => course.name || course.skill_name === selectedName
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
    fetchAllSkills();
  }, []);

  return (
    <div>
      <CreateField
        title="Course"
        list="Skill"
        route="courses"
        create="skill"
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
        chrLab={chrLab}
        setChrLab={setChrLab}
        removeCourse={removeCourse}
        fetchAllSkills={fetchAllSkills}
        file={file}
        setFile={setFile}
        loader={loader}
      />
    </div>
  );
}
