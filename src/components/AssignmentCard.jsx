"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { MdKeyboardArrowRight } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

const AssignmentCard = ({
  id,
  capacity,
  location,
  content,
  title,
  priority,
  type,
}) => {
  return (
    <Link
      href={content ? `/${type}/course/${id}` : "#"}
      className={` ${content ? "" : "cursor-auto"}`}
    >
      <div className="w-[400px] max-md:w-full mx-auto group bg-transparent pb-4 ">
        <div
          className={`rounded-xl border border-blue-100 group-hover:shadow-lg group-hover:shadow-dark-300 ${
            content ? "group-hover:cursor-pointer" : ""
          }`}
        >
          <div className="space-y-3 text-sm p-3">
            <div className="flex flex-col justify-between items-center">
              <p
                className={`w-full flex justify-center my-2 uppercase py-2 px-5 rounded-lg text-[12px] font-semibold bg-[#3abe97] text-[#fff] `}
              >
                {type}
              </p>
              <div className="flex w-full bg-[#EBF6FF] py-[9px] px-5 rounded-lg items-center">
                <div className="flex justify-evenly w-full">
                  <div className="text-blue-300 uppercase text-[12px] font-bold">
                    Capacity: {capacity}
                  </div>
                  <div className="text-blue-300 uppercase text-[12px] font-bold">
                    Location: {location}
                  </div>
                </div>
              </div>
            </div>
            <div className="font-bold space-x-2 px-2">
              <p>{title}</p>
            </div>
            <div className="space-x-2 px-2">{content}</div>
            {/* <div className="w-full h-[2px] bg-[#D7E3F1] "></div> */}

            <div className="flex  justify-between items-center">
              <div className={`flex ${content ? "" : "w-full"}`}>
                <div className="w-full ">
                  <p
                    style={{ whiteSpace: "pre-line" }}
                    className={`w-full mt-2 uppercase py-2 px-5 rounded-lg text-[12px] font-semibold bg-[#FBE7E9] text-mix-200 `}
                    // priority === "HIGH"
                    //   ? "bg-[#FBE7E9] text-[#D84848]"
                    //   : "bg-[#FEF0C7] text-[#F8A029]"
                  >
                    {Array.isArray(priority) && priority.length > 0 ? (
                      priority.map((days) => (
                        <div
                          className="flex justify-evenly items-center w-full"
                          key={days.day_of_week}
                        >
                          <div className="w-[30%]">{days.day_of_week}:</div>
                          <div>
                            {days.start_time} - {days.end_time}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center">no time is scheduled</p>
                    )}
                  </p>
                </div>
              </div>

              <Link
                href={`/${type}/course/${id}`}
                className={`text-[#fcfeff] bg-blue-300 p-1 rounded-full ${
                  content ? "" : "hidden"
                }`}
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

AssignmentCard.propTypes = {
  image: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  progress: PropTypes.string.isRequired,
  avatars: PropTypes.string.isRequired,
  extraCount: PropTypes.number,
};

export default AssignmentCard;
