import { getCourseById, getProgramById } from "@/api/route";
import React, { useEffect, useState } from "react";
import Progress from "./Progress";
import StatusSummary from "./StatusSummary";
import { useAuth } from "@/providers/AuthContext";
import { FaArrowLeft, FaEdit, FaTimes } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

const CourseHead = ({
  rating,
  instructorName,
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
  programAbb,
  // setFetch,
}) => {
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";

  const router = useRouter();
  // const session = userData?.session;
  // const session = userData?.session?.find((s) => s.course.id === id);
  const session = userData?.session;
  const studentInstructorName =
    session?.length > 0 ? session[0].instructor?.instructor_name : null;

  // console.log(session);
  // const [isEditing, setIsEditing] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [loader, setLoader] = useState(false);

  async function fetchCoursesById() {
    setLoader(true);
    try {
      const response = await getCourseById(id);
      if (response.status === 200) {
        setCourseData(response?.data?.data);
      }
    } catch (error) {
      // console.error("Error fetching course:", error);
    } finally {
      setLoader(false);
    }
  }
  async function fetchProgramById() {
    try {
      const response = await getProgramById(id);
      setLoader(true);
      if (response.status === 200) {
        const program = response?.data?.data;
        setProgramData(program);

        setLoader(false);
      } else {
        // console.error("Failed to fetch program, status:", response.status);
      }
    } catch (error) {
      // console.log("error", error);
    }
  }
  useEffect(() => {
    program === "course" && fetchCoursesById();
    program === "program" && fetchProgramById();
  }, [isEditing]);

  const goBack = () => {
    router.back();
  };

  // console.log(progress);

  return (
    <div className=" ">
      {loader ? (
        <div className="h-screen flex justify-center items-center bg-surface-100">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-col">
          <div
            key={courseData.id}
            className="flex justify-between max-md:flex-col max-md:items-center"
          >
            <div className="flex my-2 justify-center items-center cursor-default ">
              <div
                className="text-dark-400 flex gap-2 items-center cursor-pointer hover:text-blue-300 mr-4"
                onClick={goBack}
              >
                <FaArrowLeft size={20} />
                {/* <p>Back</p> */}
              </div>
              {program === "program" ? (
                <h2 className="font-exo max-md:text-center text-blue-500 text-xl font-bold">
                  {`${programData.name} ${programAbb ? `(${programAbb})` : ""}`}
                </h2>
              ) : (
                <h2 className="font-exo max-md:text-center text-blue-500 text-xl font-bold">
                  {courseData.name}
                </h2>
              )}
              <div
                className={`w-4 h-4 mx-2 max-sm:w-6 max-sm:h-6 cursor-default flex justify-center items-center rounded-full  ${
                  (program === "program"
                    ? programData.status
                    : courseData.status) === 0
                    ? "bg-mix-200"
                    : "bg-mix-300"
                }`}
              ></div>
            </div>

            <div className=" cursor-default flex items-center justify-center max-md:flex-col gap-2">
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
                  {!isStudent &&
                    (title !== "Edit course" ||
                      (title === "Edit course" && isAdmin)) && (
                      <button
                        className="flex justify-center items-center gap-2 text-surface-100 bg-blue-300 p-4 max-sm:p-2 max-sm:text-sm max-sm:rounded-md rounded-xl hover:bg-blue-700"
                        onClick={() => {
                          if (isEditing) {
                            window.location.reload();
                          } else {
                            setIsEditing(!isEditing);
                          }
                        }}
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
                <p className="flex items-center text-blue-300 font-semibold cursor-default">
                  {instructorName
                    ? `Instructor: ${instructorName}`
                    : "Instructor: To be Assigned"}
                </p>
              )}
          {program === "program" ? (
            <p className="mt-2 mb-2 text-dark-500 max-md:text-center cursor-default">
              {programData.short_description}
            </p>
          ) : (
            <p className="mt-2 mb-2 text-dark-500 max-md:text-center cursor-default">
              {courseData.short_description}
            </p>
          )}
        </div>
      )}
      {rating && (
        <div className="mr-2 flex items-center mb-8 max-sm:flex-col">
          <div className="flex bg-[#EBF6FF] w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
            <p className="bg-blue-300 w-2 h-2 rounded-full"></p>
            <p className="text-blue-300 uppercase text-[12px] ">{rating}</p>
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
