"use client";
import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import { MdKeyboardArrowRight } from "react-icons/md";
import Progress from "./Progress";
import Link from "next/link";

const CourseCard = ({
  image,
  courseName,
  courseDesc,
  progress,
  avatars,
  extraCount,
  id,
}) => {
  return (
    <Link href={`/courses/course/${id}`}>
      <div className="w-[330px] lg:mx-0 mx-auto group bg-transparent max-md:w-full f ">
        <div className="rounded-xl h-92 p-2 border border-blue-100 group-hover:cursor-pointer group-hover:border-2 group-hover:border-blue-300 my-4">
          <Image
            src={image}
            alt="here you go"
            className="p-4 w-full rounded-xl"
          />
          <div className="space-y-3 text-sm px-4 pt-[6px]">
            <div className="flex bg-[#EBF6FF] w-fit py-[9px] px-5 rounded-lg items-center space-x-2">
              <p className="bg-[#03A1D8] w-2 h-2 rounded-full"></p>
              <p className="text-[#03A1D8] uppercase text-[12px] font-semibold">
                {courseName}
              </p>
            </div>
            <div>
              <p>{courseDesc}</p>
            </div>

            {progress ? <Progress progress={progress} /> : null}
            <div className="flex justify-between items-center">
              <div className="flex pb-3 pt-2">
                <div className="flex justify-end mr-2">
                  {/* {avatars.map((avatar, index) => ( */}
                  {avatars ? (
                    <>
                      <Image
                        // key={index}
                        width={30}
                        className="border-2 border-white dark:border-gray-800 rounded-full h-8 w-8 -mr-2"
                        src={avatars}
                        alt={`Avatar `}
                      />
                      {/* ))} */}
                      {extraCount && (
                        <span className="flex items-center justify-center bg-[#EBF6FF] ml-2 dark:bg-dark-800 text-[12px] text-[#03A1D8] dark:text-white font-semibold border border-dark-200 dark:border-dark-700 rounded-full p-1">
                          +{extraCount}
                        </span>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
              <Link
                href={`/courses/course/${id}`}
                className="text-[#fcfeff] bg-[#03A1D8] p-1 rounded-full"
              >
                <MdKeyboardArrowRight size={20} />
              </Link>
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
