import React, { useState } from "react";
import PropTypes from "prop-types";
import { MdKeyboardArrowRight } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

const AssignmentCard = ({ id, category, content, title, priority, type }) => {
  return (
    <Link href={`/${type}/course/${id}`}>
      <div className="w-[360px] mx-auto group bg-transparent pb-4 ">
        <div className="rounded-xl border border-blue-100 group-hover:cursor-pointer group-hover:shadow-lg group-hover:shadow-dark-300">
          <div className="space-y-3 text-sm p-3">
            <div className="flex flex-col justify-between items-center">
              <p
                className={`w-full flex justify-center my-2 uppercase py-2 px-5 rounded-lg text-[12px] font-semibold bg-[#3abe97] text-[#fff] `}
              >
                {type}
              </p>
              <div className="flex w-full bg-[#EBF6FF] w-w-fit py-[9px] px-5 rounded-lg items-center space-x-2">
                <p className="bg-[#03A1D8] w-2 h-2 rounded-full"></p>
                <p className="text-[#03A1D8] uppercase text-[12px] font-bold">
                  {category}
                </p>
              </div>
            </div>
            <div className="font-bold space-x-2 px-2">
              <p>{title}</p>
            </div>
            <div className="space-x-2 px-2">{content}</div>
            {/* <div className="w-full h-[2px] bg-[#D7E3F1] "></div> */}

            <div className="flex justify-between items-center">
              <div className="flex ">
                <div className="w-full  ">
                  <p
                    className={`w-full flex justify-center mt-2 uppercase py-2 px-5 rounded-lg text-[12px] font-semibold bg-[#FBE7E9] text-[#D84848] `}
                    // priority === "HIGH"
                    //   ? "bg-[#FBE7E9] text-[#D84848]"
                    //   : "bg-[#FEF0C7] text-[#F8A029]"
                  >
                    {priority}
                  </p>
                </div>
              </div>

              <Link
                href={`/${type}/course/${id}`}
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

AssignmentCard.propTypes = {
  image: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  progress: PropTypes.string.isRequired,
  avatars: PropTypes.string.isRequired,
  extraCount: PropTypes.number,
};

export default AssignmentCard;
