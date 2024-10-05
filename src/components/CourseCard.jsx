"use client";
import React, { useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import { MdKeyboardArrowRight } from "react-icons/md";
import Progress from "./Progress";
import Link from "next/link";
import { useAuth } from "@/providers/AuthContext";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import DeleteConfirmationPopup from "./Modal/DeleteConfirmationPopUp";
import { toast } from "react-toastify";
import { deleteCourse } from "@/api/route";

const CourseCard = ({
  image,
  courseName,
  courseDesc,
  progress,
  avatars,
  extraCount,
  status,
  id,
  route,
  chr,
  route1,
}) => {
  const { userData } = useAuth();
  const isAdmin = userData?.Group === "admin";
  const isStudent = userData?.Group === "student";
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // const handleDeleteClick = (id) => {
  //   setSelectedQuiz(id);
  //   setConfirmDelete(true);
  // };

  // const handleDelete = async () => {
  //   try {
  //     if (handleDeleteCourse) {
  //       await handleDeleteCourse(selectedQuiz);
  //       setConfirmDelete(false);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting the ", error);
  //   }
  // };
  // const handleDeleteCourse = async (id) => {
  //   // if (!courseToDelete) {
  //   //   toast.error("Assignment not found");
  //   //   return;
  //   // }

  //   const data = { status: 2 };

  //   try {
  //     const response = await deleteCourse(data, id);

  //     if (response.status === 200) {
  //       toast.success("Assignment deleted successfully!");
  //       // fetchAssignments();
  //     } else {
  //       toast.error("Error deleting assignment", response?.message);
  //     }
  //   } catch (error) {
  //     toast.error("Error deleting assignment", error);
  //     console.error(error);
  //   }
  // };

  return (
    <Link href={`/${route1}/${route}/${id}`} className="mx-1">
      <div className="w-[330px] bg-surface-100 rounded-xl lg:mx-0 group max-md:w-full">
        <div className="mx-1 rounded-xl h-[320px] p-2 border border-blue-100 group-hover:cursor-pointer group-hover:border-2 group-hover:border-blue-300 my-4">
          <div className="relative">
            <Image
              src={image}
              alt="course-image"
              className="p-4 w-full rounded-xl"
            />
            <p
              className={`absolute top-0 right-0 w-20 p-2 rounded-md flex items-center justify-center  ${
                status === 0
                  ? "bg-mix-200 text-surface-100"
                  : "bg-mix-300 text-surface-100"
              }`}
            >
              {status === 0 ? "Inactive" : "Active"}
            </p>
          </div>
          <div className="space-y-2 text-sm px-4 pt-[6px]">
            <div className="flex justify-between">
              <div className="flex bg-[#EBF6FF] w-full py-[9px] px-5 rounded-lg items-center space-x-2">
                {/* <p className="bg-blue-300 w-2 h-2 rounded-full"></p> */}
                <p className="text-blue-300 h-4 uppercase text-[12px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                  {courseName}
                </p>{" "}
              </div>
            </div>
            {/* {chr && (
              // <div className="flex bg-[#EBF6FF] w-fit py-[9px] px-5 rounded-lg items-center space-x-2">
              <p className="text-blue-300 h-4 uppercase text-xs font-semibold line-clamp-1">
                Cr. Hr: {chr}
              </p>
              // </div>
            )} */}
            <div>
              <p className="line-clamp-2 h-10">{courseDesc}</p>
            </div>

            {progress ? <Progress progress={progress} /> : null}
            <div className="flex justify-between items-center">
              <div className="flex pb-3 pt-2">
                {/* <div className="flex justify-end mr-2"> */}
                {/* {avatars.map((avatar, index) => (
                {avatars ? (
                    <>
                      <Image
                        width={30}
                        className="border-2 border-white dark:border-gray-800 rounded-full h-8 w-8 -mr-2"
                        src={avatars}
                        alt={`Avatar `}
                      />

                      {extraCount && (
                        <span className="flex items-center justify-center bg-[#EBF6FF] ml-2 dark:bg-dark-800 text-[12px] text-blue-300 dark:text-white font-semibold border border-dark-200 dark:border-dark-700 rounded-full p-1">
                          +{extraCount}
                        </span>
                      )}
                    </>
                  ) : null}  */}
                {/* </div> */}
              </div>

              {isStudent ? (
                <Link
                  href={`/${route}s/${route}/${id}`}
                  className="text-[#fcfeff] bg-blue-300 p-1 rounded-full"
                >
                  <MdKeyboardArrowRight size={20} />
                </Link>
              ) : isAdmin ? (
                <div className="flex w-full ">
                  {/* {route === "course" && route1 === "courses" && (
                  <button
                    onClick={() => handleDeleteClick(id)}
                    className="flex gap-1 justify-center items-center w-full h-4 bg-[#FBE7E9] border text-mix-200 border-mix-200 p-4 rounded-lg mr-2 "
                  >
                    <FaTrashAlt fill="#d84848" size={20} />
                    Delete
                  </button>
                )} */}
                  <Link
                    href={`/${route1}/${route}/${id}`}
                    className=" flex gap-1 justify-center items-center w-full h-4 bg-[#DDF8EE] border text-mix-300 border-mix-300 p-4 rounded-lg "
                  >
                    <FaEye fill="#18a07a" size={20} />
                    View
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/${route1}/${route}/${id}`}
                  className=" flex gap-1 justify-center items-center w-full h-4 bg-[#DDF8EE] border text-mix-300 border-mix-300 p-4 rounded-lg "
                >
                  <FaEye fill="#18a07a" size={20} />
                  View
                </Link>
              )}

              {confirmDelete && (
                <DeleteConfirmationPopup
                  setConfirmDelete={setConfirmDelete}
                  handleDelete={handleDelete}
                  field="course"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

CourseCard.propTypes = {
  image: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  progress: PropTypes.string.isRequired,
  avatars: PropTypes.string.isRequired,
  extraCount: PropTypes.number,
};
export default CourseCard;
