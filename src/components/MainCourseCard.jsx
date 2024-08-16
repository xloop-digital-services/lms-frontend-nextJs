"use client";
import { useSidebar } from "@/providers/useSidebar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaArrowAltCircleRight,
  FaArrowRight,
  FaChevronCircleRight,
} from "react-icons/fa";
import Progress from "./Progress";

export default function MainCourseCard({
  courseImg,
  altText,
  courseName,
  courseDesc,
  progress,
  durationOfCourse,
  route,
}) {
  return (
    <>
    <Link href={route}>
      <div className="w-full bg-surface-100 p-8 rounded-xl">
        <div className="border border-2 border-dark-300 rounded-xl p-10 flex max-md:flex-col hover:border-blue-300">
          <div className="w-100 mr-4">
            <Image
              src={courseImg}
              alt={altText}
              className="rounded-xl "
              width={600}
              height={40}
            />
          </div>

          <div className="w-full flex flex-col justify-between ">
            <div className="">
              <div className="flex bg-[#EBF6FF] w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
                <p className="bg-[#03A1D8] w-2 h-2 rounded-full"></p>
                <p className="text-[#03A1D8] uppercase text-[12px] font-bold ">
                  {courseName}
                </p>
              </div>

              <div className="flex justify-between mt-4 mb-4">
                <p clcassName="">{courseDesc}</p>
                {progress ? <p className="text-blue-300">50</p> : null}
              </div>

              {progress ? <Progress progress={progress} /> : null}
            </div>

            <div className="flex max-md:mt-4 justify-between">
              <div className="flex">
                <p className=""> Duration: &nbsp; </p>
                <p className="text-blue-300">
                  {" "}
                  {durationOfCourse} Credit hours
                </p>
              </div>

              <Link href={`${route}`}>
                <FaChevronCircleRight size={24} fill="#03A1D8" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      </Link>
    </>
  );
}
