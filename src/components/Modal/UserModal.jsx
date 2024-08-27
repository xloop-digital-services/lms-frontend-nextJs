import React from "react";
import image from "../../../public/assets/img/images.png";
import { IoClose } from "react-icons/io5";
import { PiListPlusFill } from "react-icons/pi";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import Image from "next/image";

const UserModal = ({ setModal }) => {
  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className="min-w-[40%]  z-[1000] mx-auto my-20">
        <div style={{ backgroundColor: "#EBF6FF" }} className="p-5 rounded-xl">
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#07224D",
              }}
              className="text-start  px-2 py-[10px]"
            >
              User Information
            </h1>
            <button className="px-2" onClick={() => setModal(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div
            className={`bg-surface-100 p-6 rounded-xl flex flex-col justify-start space-y-5 `}
          >
            {/* <div className=" flex justify-center items-center w-full">
              <Image src={image} className="w-[30%]" />
            </div> */}
            <div>
              <h1 className="text-2xl text-center">Floyd Miles</h1>
              <p className="text-sm text-dark-400 text-center">
                floydmiles@gmail.com
              </p>
            </div>

            <div className="w-full h-[2px] bg-dark-200"></div>
            <div className="px-[70px] text-base">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-[#d7e4ee]">
                    <td className="text-dark-400 text-center py-2">Age</td>
                    <td className="text-center py-2">16 years</td>
                  </tr>
                  <tr className="border-b border-[#d7e4ee]">
                    <td className="text-dark-400 text-center py-2">Area</td>
                    <td className="text-center py-2">Gulberg</td>
                  </tr>
                  <tr className="border-b border-[#d7e4ee]">
                    <td className="text-dark-400 text-center py-2">City</td>
                    <td className="text-center py-2">Karachi</td>
                  </tr>
                  <tr className="border-b border-[#d7e4ee]">
                    <td className="text-dark-400 text-center py-2">Contact</td>
                    <td className="text-center py-2">0318289490</td>
                  </tr>
                  <tr className="border-b border-[#d7e4ee]">
                    <td className="text-dark-400 text-center py-2">
                      Education
                    </td>
                    <td className="text-center py-2">BS(CS)</td>
                  </tr>
                  <tr className="">
                    <td className="text-dark-400 text-center px-2 py-2">
                      Areas of Interest
                    </td>
                    <td className="text-center py-2 px-2">
                      <div className="flex gap-2">
                        <p className="border border-dark-200 py-1 px-2 w-fit rounded-lg">
                          Java
                        </p>
                        <p className="border border-dark-200 py-1 px-2 w-fit rounded-lg">
                          Javascript
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex flex-row w-full justify-evenly pt-4">
                <div>
                  <div className="group relative flex justify-center items-center text-[#03A1D8] text-sm font-bold">
                    <div className="shadow-md flex items-center group-hover:gap-2 p-3 rounded-full cursor-pointer duration-300">
                      <PiListPlusFill size={23} className="fill-zinc-600" />
                      <span className="text-[0px] group-hover:text-sm duration-300">
                        Shortlist
                      </span>
                    </div>
                  </div>
                </div>
                <div className="group relative flex justify-center items-center text-[#D84848] text-sm font-bold">
                  <div className="shadow-md flex items-center group-hover:gap-2 p-3 rounded-full cursor-pointer duration-300">
                    <IoMdCloseCircle size={24} className="fill-zinc-600" />
                    <span className="text-[0px] group-hover:text-sm duration-300">
                      Reject
                    </span>
                  </div>
                </div>
                <div className="group relative flex justify-center items-center text-[#18A07A] text-sm font-bold">
                  <div className="shadow-md flex items-center group-hover:gap-2 p-3 rounded-full cursor-pointer duration-300">
                    <FaCheckCircle size={20} className="fill-zinc-600" />
                    <span className="text-[0px] group-hover:text-sm duration-300">
                      Approved
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
