import { getCourseById, getProgramById } from "@/api/route";
import React, { useEffect, useState } from "react";
import Progress from "./Progress";
import StatusSummary from "./StatusSummary";
import { useAuth } from "@/providers/AuthContext";
import { FaEdit, FaTimes } from "react-icons/fa";

const CourseHead = ({
  rating,
  // instructorName,
  id,
  progress,
  name,
  chr,
  isEditing,
  shortDesc,
  setIsEditing,
  title,
  program,
  haveStatus,
  // setFetch,
}) => {
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  // const session = userData?.session;
  // const session = userData?.session?.find((s) => s.course.id === id);
  const session = userData?.session;
  const studentInstructorName =
    session?.length > 0 ? session[0].instructor?.instructor_name : null;

  console.log(session);
  // const [isEditing, setIsEditing] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [loader, setLoader] = useState(false);
  async function fetchCoursesById() {
    const response = await getCourseById(id);
    try {
      if (response.status === 200) {
        setCourseData(response?.data?.data);
        // setFetch(true);
        console.log(courseData);
      } else {
        console.error("Failed to fetch user, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchProgramById() {
    try {
      const response = await getProgramById(id);
      setLoader(true);
      if (response.status === 200) {
        const program = response?.data?.data;
        setProgramData(program);
        // console.log(program);
        // setFetch(true);
        // if (program.courses && program.courses.length > 0) {
        //   const courses = await Promise.all(
        //     program.courses.map(async (courseId) => {
        //       const courseResponse = await getCourseById(courseId);
        //       return courseResponse?.data?.data;
        //     })
        //   );
        //   setCourseData(courses);
        // }
        setLoader(false);
      } else {
        console.error("Failed to fetch program, status:", response.status);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  // console.log("PS", programData.status);
  // console.log("CS", courseData.status);
  useEffect(() => {
    program === "course" && fetchCoursesById();
    program === "program" && fetchProgramById();
  }, [isEditing]);

  // console.log(progress);

  return (
    <div className=" ">
      <div className="flex flex-col">
        <div
          key={courseData.id}
          className="flex justify-between max-md:flex-col max-md:items-center"
        >
          <div className="flex my-2 justify-center items-center ">
            {program === "program" ? (
              <h2 className=" font-exo text-xl font-bold">
                {programData.name}
              </h2>
            ) : (
              <h2 className="font-exo text-xl font-bold">{courseData.name}</h2>
            )}
            <div
              className={`w-4 h-4 mx-2 flex justify-center items-center rounded-full ${
                (program === "program"
                  ? programData.status
                  : courseData.status) === 0
                  ? "bg-mix-200"
                  : "bg-mix-300"
              }`}
            ></div>
          </div>

          <div className=" flex items-center justify-center max-md:flex-col gap-2">
            {program === "program" ? null : (
              <>
                {chr ? (
                  <p className="text-blue-300 font-bold ">
                    Cr. hrs: {chr} hours
                  </p>
                ) : (
                  <p className="text-blue-300 font-bold ">
                    Cr. hrs: {courseData.theory_credit_hours}+
                    {courseData.lab_credit_hours} hours
                  </p>
                )}
              </>
            )}

            {title ? (
              <>
                {!isStudent && (
                  <button
                    className=" flex justify-center items-center gap-2  text-surface-100 bg-blue-300 p-4 rounded-xl hover:bg-[#4296b3]"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <p className="flex justify-center items-center gap-2">
                        <FaTimes />
                        Cancel
                      </p>
                    ) : (
                      <p className="flex justify-center items-center gap-2">
                        <FaEdit /> {title}
                      </p>
                    )}
                  </button>
                )}
              </>
            ) : null}
          </div>
        </div>
        {program === "program"
          ? null
          : isStudent && (
              <p className="flex items-center text-blue-300 font-semibold">
                {studentInstructorName
                  ? `Instructor: ${studentInstructorName}`
                  : null}
              </p>
            )}
        {program === "program" ? (
          <p className="mt-2 mb-2 text-dark-500 max-md:text-center">
            {programData.short_description}
          </p>
        ) : (
          <p className="mt-2 mb-2 text-dark-500 max-md:text-center">
            {courseData.short_description}
          </p>
        )}
      </div>
      {rating && (
        <div className="mr-2 flex items-center mb-8 max-sm:flex-col">
          <div className="flex bg-[#EBF6FF] w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
            <p className="bg-[#03A1D8] w-2 h-2 rounded-full"></p>
            <p className="text-[#03A1D8] uppercase text-[12px] ">{rating}</p>
          </div>
        </div>
      )}

      {progress ? <Progress progress={progress} /> : null}

      {haveStatus ? <StatusSummary /> : null}
      {/* </div>
      </div> */}

      <hr className="my-5 text-dark-200"></hr>
    </div>
  );
};

export default CourseHead;
