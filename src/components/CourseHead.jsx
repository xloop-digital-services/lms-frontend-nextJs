import { getCourseById } from "@/api/route";
import React, { useEffect, useState } from "react";
import Progress from "./Progress";

const CourseHead = ({ rating, instructorName, id, progress }) => {
  const [courseData, setCourseData] = useState([]);

  async function fetchCoursesById() {
    const response = await getCourseById(id);
    try {
      if (response.status === 200) {
        setCourseData(response?.data?.data);
        console.log(courseData);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    fetchCoursesById();
  }, []);

  // console.log(progress);

  return (
    <div className=" ">
      <div className="flex flex-col">
        <div
          key={courseData.id}
          className="flex justify-between max-md:flex-col max-md:items-center"
        >
          <h2 className="text-xl font-bold">{courseData.name}</h2>
          <p className="text-blue-300 font-bold ">
            Cr. hrs: {courseData.credit_hours} hours
          </p>
        </div>

        <p className="mt-2 mb-2 text-dark-500 max-md:text-center">
          {courseData.short_description}
        </p>
      </div>
      <div className=" flex items-center mb-8 max-sm:flex-col">
        <div className="flex bg-[#EBF6FF] w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
          <p className="bg-[#03A1D8] w-2 h-2 rounded-full"></p>
          <p className="text-[#03A1D8] uppercase text-[12px] ">{rating}</p>
        </div>
        <p className="ml-2 flex items-center"> Instructor: {instructorName}</p>
      </div>
      {progress ? <Progress progress={progress} /> : null}

      <hr className="my-8 text-dark-200"></hr>
    </div>
  );
};

export default CourseHead;
