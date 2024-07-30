import React from "react";
import PropTypes from "prop-types";
import { MdKeyboardArrowRight } from "react-icons/md";
import Image from "next/image";

const AssignmentCard = ({
  category,
  content,
  title,
  priority,
  avatars,
  extraCount,
}) => {
  return (
    <div className="w-[370px] group bg-transparent h-auto ">
      <div className="rounded-xl border group-hover:cursor-pointer group-hover:shadow-lg group-hover:shadow-gray-300">
        <div className="space-y-3 text-sm px-3 pt-2">
          <div className="flex justify-between items-center">
            <div className="flex bg-[#EBF6FF] w-fit py-[9px] px-5 rounded-lg items-center space-x-2">
              <p className="bg-[#03A1D8] w-2 h-2 rounded-full"></p>
              <p className="text-[#03A1D8] uppercase text-[12px] ">
                {category}
              </p>
            </div>
            <div className=" ">
              <p
                className={`uppercase py-2 px-5 rounded-lg text-[12px] font-semibold ${
                  priority === "HIGH"
                    ? "bg-[#FBE7E9] text-[#D84848]"
                    : "bg-[#FEF0C7] text-[#F8A029]"
                }`}
              >
                {priority}
              </p>
            </div>
          </div>
          <div className="font-bold">
            <p>{title}</p>
          </div>
          <div>{content}</div>
          <div className="w-full h-[2px] bg-[#D7E3F1] "></div>

          <div className="flex justify-between items-center">
            <div className="flex pb-3 pt-2">
              <div className="flex justify-end mr-2">
                {/* {avatars.map((avatar, index) => ( */}
                <Image
                //   key={index}
                  className="border-2 border-white dark:border-gray-800 rounded-full h-8 w-8 -mr-2"
                  src={avatars}
                  alt="people"
                //   alt={`Avatar ${index}`}
                  width={10}
                  height={10}
                />
                {/* ))} */}
                {extraCount && (
                  <span className="flex items-center justify-center bg-[#EBF6FF] ml-2 dark:bg-gray-800 text-sm text-[#03A1D8] dark:text-white font-semibold border-2 border-gray-200 dark:border-gray-700 rounded-full p-1">
                    +{extraCount - avatars.length}
                  </span>
                )}
              </div>
            </div>
            <div className="text-[#fcfeff] bg-[#03A1D8] p-1 rounded-full">
              <MdKeyboardArrowRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
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
