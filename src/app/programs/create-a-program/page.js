"use client";
import { createProgram, getAllCourses } from "@/api/route";
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
  const [file, setFile] = useState(null);
  const [programAbb, setProgramAbb] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [inputCourses, setInputCourses] = useState([]);

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
    // console.log(event);
    event.preventDefault();
    const s3Data = await handleFileUploadToS3(
      file,
      "Upload Program Thumbnails"
    );

    const formData = new FormData();
    formData.append("name", programName);
    formData.append("program_abb", programAbb);
    formData.append("short_description", shortDesc);
    formData.append("about", about);
    const flattenedCourses = inputCourses.flat(Infinity);
    // console.log(flattenedCourses);
    
    flattenedCourses.forEach((id) => {
      formData.append("courses[]", id);
    });
    if (file) {
      formData.append("picture", s3Data);
    }

    try {
      const response = await createProgram(formData);
      if (response.status === 201) {
        toast.success("Program created successfully!");
        router.back();
        setCreatingProgram(formData);
        setAbout("");
        setCoursesNames([]);
        setProgramName("");
        setShortDesc("");
        setProgramAbb("");
        localStorage.removeItem("programName");
        localStorage.removeItem("programAbb");
        localStorage.removeItem("shortDesc");
        localStorage.removeItem("about");
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      toast.error(`Error creating program: ${error.message}`);
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
        programAbb={programAbb}
        setProgramAbb={setProgramAbb}
        file={file}
        setFile={setFile}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        handleImageUpload={handleImageUpload}
      />
    </div>
  );
}
