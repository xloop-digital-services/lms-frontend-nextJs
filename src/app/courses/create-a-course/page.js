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
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFile(file);
    // console.log(file);
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.warn("Only JPG, JPEG, and PNG files are allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!programName.trim()) {
      toast.error("Course name is required.");
      return;
    }
    if (!shortDesc.trim()) {
      toast.error("Short description is required.");
      return;
    }
    if (!about.trim()) {
      toast.error("About field is required.");
      return;
    }

    if (!inputCourses || inputCourses.length === 0) {
      toast.error("Please add at least one skill.");
      return;
    }
    if (!chr && !chrLab) {
      toast.error("Please provide at least one credit hour.");
      return;
    }
    if (!file) {
      toast.error("Please upload a course thumbnail.");
      return;
    }

    setLoader(true); 

    try {
      const s3Data = await handleFileUploadToS3(
        file,
        "Upload Course Thumbnails"
      );

      const formData = new FormData();
      formData.append("name", programName);
      formData.append("short_description", shortDesc);
      formData.append("about", about);
      formData.append("theory_credit_hours", chr || 0);
      formData.append("lab_credit_hours", chrLab || 0);

      const flattenedCourses = inputCourses.flat(Infinity);
      flattenedCourses.forEach((id) => {
        formData.append("skills[]", id);
      });

      if (s3Data) {
        formData.append("picture", s3Data);
      }

      const response = await createCourse(formData);

      if (response.status === 201) {
        toast.success("Course created successfully!");
        setCreatingProgram(formData); 
        setAbout("");
        setCoursesNames([]);
        setProgramName("");
        setShortDesc("");
        setChr("");
        setChrLab("");
        router.back();
      } else {
        toast.error(response.data?.message || "Failed to create course.");
      }
    } catch (error) {
      toast.error(`Error creating course: ${error.message}`);
    } finally {
      setLoader(false);
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
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        handleImageUpload={handleImageUpload}
      />
    </div>
  );
}
